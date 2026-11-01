/**
 * Transparent rule-based client-side matching algorithm.
 * Compares Lost and Found reports based on category, title, description keywords,
 * color, brand, location, and date proximity.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'left', 'found', 'lost', 'please', 'near', 'approx', 'around',
  'item', 'belonging', 'campus', 'student', 'very', 'urgent', 'inside', 'outside'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

export const matchingService = {
  /**
   * Find possible matches for a given item from an array of listings
   * @param {Object} targetItem - The item to find matches for (lost or found)
   * @param {Array} allItems - The pool of items to compare against
   * @param {number} minScore - Minimum match threshold score (0-100)
   * @returns {Array} List of matched items with scores and explainability reasons
   */
  findMatches(targetItem, allItems = [], minScore = 25) {
    if (!targetItem) return [];

    // Match against opposite type: if target is lost, compare against found; and vice versa
    const candidateType = targetItem.type === 'lost' ? 'found' : 'lost';
    const candidates = allItems.filter(item => item.id !== targetItem.id && item.type === candidateType);

    const targetTitleTokens = new Set(tokenize(targetItem.title));
    const targetDescTokens = new Set(tokenize(targetItem.description));
    const targetBrand = (targetItem.brand || '').toLowerCase().trim();
    const targetColor = (targetItem.color || '').toLowerCase().trim();
    const targetLocation = (targetItem.location || '').toLowerCase().trim();
    const targetDate = new Date(targetItem.date || targetItem.createdAt).getTime();

    const matches = [];

    for (const item of candidates) {
      let score = 0;
      const reasons = [];

      // 1. Category Matching (Weight: 30%)
      if (item.category && targetItem.category && item.category.toLowerCase() === targetItem.category.toLowerCase()) {
        score += 30;
        reasons.push({
          type: 'category',
          text: `Exact category match: ${item.category}`,
          weight: '+30%'
        });
      }

      // 2. Title Keyword Overlap (Weight: up to 25%)
      const itemTitleTokens = tokenize(item.title);
      const commonTitleTokens = itemTitleTokens.filter(t => targetTitleTokens.has(t));
      if (commonTitleTokens.length > 0) {
        const titleScore = Math.min(25, commonTitleTokens.length * 10);
        score += titleScore;
        reasons.push({
          type: 'title',
          text: `Key name terms match: "${commonTitleTokens.join(', ')}"`,
          weight: `+${titleScore}%`
        });
      }

      // 3. Location Match (Weight: 15%)
      const itemLocation = (item.location || '').toLowerCase().trim();
      if (itemLocation && targetLocation) {
        if (itemLocation === targetLocation) {
          score += 15;
          reasons.push({
            type: 'location',
            text: `Same campus zone: ${item.location}`,
            weight: '+15%'
          });
        } else if (itemLocation.includes(targetLocation) || targetLocation.includes(itemLocation)) {
          score += 10;
          reasons.push({
            type: 'location',
            text: `Nearby campus area: ${item.location}`,
            weight: '+10%'
          });
        }
      }

      // 4. Brand & Color Similarity (Weight: up to 15%)
      const itemBrand = (item.brand || '').toLowerCase().trim();
      const itemColor = (item.color || '').toLowerCase().trim();

      if (targetBrand && itemBrand && (targetBrand.includes(itemBrand) || itemBrand.includes(targetBrand))) {
        score += 10;
        reasons.push({
          type: 'brand',
          text: `Matching brand: ${item.brand}`,
          weight: '+10%'
        });
      }

      if (targetColor && itemColor) {
        const targetColorTokens = tokenize(targetColor);
        const itemColorTokens = tokenize(itemColor);
        const commonColor = itemColorTokens.some(c => targetColorTokens.includes(c));
        if (commonColor) {
          score += 5;
          reasons.push({
            type: 'color',
            text: `Matching colour characteristic: ${item.color}`,
            weight: '+5%'
          });
        }
      }

      // 5. Description Keyword Overlap (Weight: up to 10%)
      const itemDescTokens = tokenize(item.description);
      const commonDescTokens = itemDescTokens.filter(t => targetDescTokens.has(t));
      if (commonDescTokens.length > 0) {
        const descScore = Math.min(10, commonDescTokens.length * 3);
        score += descScore;
        reasons.push({
          type: 'description',
          text: `Shared descriptive terms (${commonDescTokens.slice(0, 3).join(', ')})`,
          weight: `+${descScore}%`
        });
      }

      // 6. Date Proximity (Weight: 5%)
      const itemDate = new Date(item.date || item.createdAt).getTime();
      const diffDays = Math.abs(targetDate - itemDate) / (1000 * 60 * 60 * 24);
      if (diffDays <= 3) {
        score += 5;
        reasons.push({
          type: 'date',
          text: `Reported within ${Math.round(diffDays)} day(s) of each other`,
          weight: '+5%'
        });
      }

      // Cap at 100
      const finalScore = Math.min(100, Math.round(score));

      if (finalScore >= minScore) {
        matches.push({
          item,
          score: finalScore,
          confidence: finalScore >= 70 ? 'High' : finalScore >= 45 ? 'Moderate' : 'Low',
          reasons
        });
      }
    }

    // Sort by highest score first
    return matches.sort((a, b) => b.score - a.score);
  }
};
