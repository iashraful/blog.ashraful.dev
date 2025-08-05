---
title: Setting Up Pi-hole in Docker with Proper DNS Configuration
date: 2025-08-05T00:45:48.644Z
excerpt: Pi-Hole is a powerful network-wide ad blocker that works by filtering DNS requests. Running Pi-hole inside Docker gives you flexibility and isolation, but configuring it properly — especially port 53 and local DNS — requires a few extra steps.
type: post
blog: false
homeServerSeries: true
order: 1
image: /images/pi-hole.png
tags:
  - pihole
  - dns
  - ubuntu
  - server

---
## This guide walks through

1. Installing Pi-hole with Docker Compose  
2. Ensuring port 53 is available  
3. Disabling the system's DNS resolver if necessary  
4. Configuring your router to use Pi-hole  
5. Setting up local DNS entries (if you need)

---

## 📦 Step 1: Install Pi-hole Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: "3"

services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    restart: unless-stopped
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "8080:80"
      - "8443:443"
    environment:
      TZ: "Asia/Dhaka"
      WEBPASSWORD: "changeme"
    volumes:
      - "./etc-pihole/:/etc/pihole/"
      - "./etc-dnsmasq.d/:/etc/dnsmasq.d/"
    dns:
      - 127.0.0.1
      - 1.1.1.1
    cap_add:
      - NET_ADMIN
```

Then run:

```bash
docker compose up -d
```

---

## 🚪 Step 2: Make Sure Port 53 Is Available

Port 53 is critical for DNS. Run this to check if it's already in use:

```bash
sudo lsof -i :53
```

If you see something like `systemd-resolved` or `named`, you need to free that port.

---

## 🛑 Step 3: Disable the System DNS Resolver (If Needed)

On most Linux distros, `systemd-resolved` binds to port 53 by default.

To disable it:

```bash
sudo systemctl disable --now systemd-resolved
```

Also replace the symlink for `/etc/resolv.conf`:

```bash
sudo rm /etc/resolv.conf
echo "nameserver 127.0.0.1" | sudo tee /etc/resolv.conf
```

(You can also add a fallback like `8.8.8.8` if needed.)

---

## 🌐 Step 4: Configure Your Router to Use Pi-hole

To apply ad blocking to your whole network:

1. Log into your router admin page  
2. Find the **DHCP/DNS settings**  
3. Set **Primary DNS** to the IP of your Pi-hole server (e.g., `192.168.1.10`)  
4. Remove or override any secondary DNS that bypasses Pi-hole (like `8.8.8.8`)  

Now all devices will query Pi-hole for DNS.

---

## 🧭 Step 5: Configure Local DNS (And Why)

### ✅ Why Configure Local DNS?

Setting up local DNS allows you to:

- Access devices by name (`nas.local`, `printer.lan`, etc.)
- Avoid typing IP addresses manually
- Make services on your home server feel more like the cloud

### 🔧 How to Do It

1. Go to **Pi-hole Admin Panel → Local DNS → DNS Records**
2. Add entries like:

```
movie.ashraful.dev → 192.168.10.10
nas.lan → 192.168.10.20
```

3. Test from any device:

```bash
ping movie.ashraful.dev
```

If it resolves, you're all set!

---

## ✅ Summary

- Pi-hole in Docker is clean and powerful — just make sure port 53 is free.
- Disable `systemd-resolved` if it blocks port 53.
- Set your router’s DNS to point to Pi-hole to enable network-wide filtering.
- Use local DNS to make your network smarter and easier to use.

Enjoy ad-free browsing across your entire network! 🧠🛡️
