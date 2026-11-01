import socket
import subprocess
import re
import platform

def get_primary_local_ip():
    """
    Detect the primary active local IP address reachable on the local Wi-Fi / Hotspot / LAN.
    Uses socket UDP connection probe (no actual packet is transmitted).
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Connecting to a public address (doesn't actually send packets) forces the OS
        # to pick the active network interface route.
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        if ip and not ip.startswith('127.'):
            return ip
    except Exception:
        pass
    finally:
        s.close()

    # Fallback method: check hostnames
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith('127.') and ':' not in ip:
                return ip
    except Exception:
        pass

    return '127.0.0.1'

def get_all_local_ips():
    """
    Returns a list of unique IPv4 addresses detected across all active network adapters.
    """
    ips = set()
    primary = get_primary_local_ip()
    if primary and primary != '127.0.0.1':
        ips.add(primary)

    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith('127.') and ':' not in ip:
                ips.add(ip)
    except Exception:
        pass

    # Sort so private LAN IPs (192.168, 10., 172.16-31) appear first
    def ip_sort_key(addr):
        if addr == primary:
            return 0
        if addr.startswith(('192.168.', '10.', '172.')):
            return 1
        return 2

    return sorted(list(ips), key=ip_sort_key)

def format_network_banner(host, port):
    """
    Creates an eye-catching ASCII terminal banner with active connection links and instructions.
    """
    primary_ip = get_primary_local_ip()
    all_ips = get_all_local_ips()
    
    url = f"http://{primary_ip}:{port}"
    
    banner = f"""
====================================================================
  [+] CampusDrop - Local Internet-Independent File Sharing 
====================================================================
  * Primary Sharing URL:
    -> {url}

  * Scan QR code on webpage or open link in any browser!
  * Zero internet required. Works over Wi-Fi, Hotspot, or LAN.
"""
    if len(all_ips) > 1:
        banner += "  * Alternative Local IPs:\n"
        for ip in all_ips:
            if ip != primary_ip:
                banner += f"    -> http://{ip}:{port}\n"
                
    banner += "====================================================================\n"
    return banner
