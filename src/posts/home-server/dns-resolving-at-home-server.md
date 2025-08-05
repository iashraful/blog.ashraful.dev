---
title: Fixing DNS Resolution After Disabling systemd-resolved for Pi-hole
date: 2025-08-05T00:39:48.644Z
excerpt: After switching my home server's DNS over to Pi-hole, I disabled systemd-resolved to keep all traffic filtered. That’s when things broke — especially for Python apps using dnspython. Here’s how I fixed the DNS chaos by rewriting /etc/resolv.conf.
type: post
blog: true
image: /images/pi-hole.png
tags:
  - pihole
  - dns
  - ubuntu
  - server

---

However, after doing this, I ran into a strange issue: some Python programs (specifically those using `dnspython`) could no longer resolve domain names. Here's how I diagnosed and fixed the problem.

---

## 🔍 The Problem

To route DNS through Pi-hole, I disabled `systemd-resolved`:

```bash
sudo systemctl disable --now systemd-resolved
```

My home server then used Pi-hole's IP (e.g., `192.168.10.10`) as its DNS server. Most things worked fine — `ping`, `curl`, and `dig` had no issues.

But some Python code using `dnspython` threw an error like:

```
dns.resolver.NoNameservers: All nameservers failed to answer the query
```

Or even:

```
FileNotFoundError: [Errno 2] No such file or directory: '/etc/resolv.conf'
```

---

## 🧠 What’s Going On?

Many programs — including `dnspython` — read DNS server information directly from `/etc/resolv.conf`.

When `systemd-resolved` is active, `/etc/resolv.conf` is often a **symlink** to a dynamically generated file like:

```bash
/etc/resolv.conf -> ../run/systemd/resolve/stub-resolv.conf
```

But once `systemd-resolved` is disabled, this symlink points to a non-existent file. Programs depending on it will fail to resolve any domains.

---

## ✅ The Fix

We need to **replace the broken symlink** with a static `resolv.conf` file that directly specifies our Pi-hole DNS.

### 1. Remove the broken symlink

```bash
sudo rm /etc/resolv.conf
```

### 2. Create a new static file

```bash
sudo nano /etc/resolv.conf
```

Paste your Pi-hole DNS IP (replace with your actual IP):

```text
nameserver 192.168.10.10
```

Optionally, add a fallback:

```text
nameserver 192.168.10.10
nameserver 8.8.8.8
```

Save and close the file.

### 3. (Optional) Prevent overwrites

To ensure no other service modifies it (e.g., NetworkManager):

```bash
sudo chattr +i /etc/resolv.conf
```

To remove the protection later:

```bash
sudo chattr -i /etc/resolv.conf
```

---

## 🧪 Test DNS Resolution

Using `nslookup`:

```bash
nslookup google.com
```

Using Python:

```python
import dns.resolver
result = dns.resolver.resolve("google.com")
print(result[0])
```

If everything is working, you'll get a valid IP response.

---

## 🧵 Summary

Because I'm using **Pi-hole as my network guardian**, I wanted to disable any system-level DNS services that could bypass it. Disabling `systemd-resolved` was necessary — but it broke `/etc/resolv.conf`, which some programs still depend on.

By creating a **manual `resolv.conf`** that points to Pi-hole, I ensured full DNS functionality while keeping all traffic filtered and protected.

---

Happy tinkering! 🛠️🧠🔒
