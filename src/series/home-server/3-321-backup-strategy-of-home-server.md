---
title: Building a Rock-Solid Home Server Backup Strategy - My 3-2-1 Approach
date: 2025-08-05T00:39:48.644Z
excerpt: In this blog post, I’ll walk you through how I’ve implemented this strategy using a combination of **external SSD storage** and **network-based backups over SSH**. 
type: post
blog: false
homeServerSeries: true
order: 3
image: /images/backup-321.png
tags:
  - backup
  - rsync
  - ubuntu
  - server

---

When you’re running a home server that stores your personal files, photos, media, and even services like Pi-hole or Jellyfin, **a proper backup strategy isn’t optional—it’s essential**. Data loss can happen due to hardware failure, accidental deletion, or even corruption. That’s why I follow a proven and practical method known as the **3-2-1 backup strategy**.

In this blog post, I’ll walk you through how I’ve implemented this strategy using a combination of **external SSD storage** and **network-based backups over SSH**.

---

## What is the 3-2-1 Backup Strategy?

The 3-2-1 rule is a simple yet powerful backup principle:

- **3** copies of your data (1 primary + 2 backups)
- **2** different types of media (e.g., SSD, HDD, cloud, etc.)
- **1** copy stored offsite

This strategy reduces the risk of total data loss by spreading your backups across multiple locations and types of storage.

---

## 1. Primary Storage: My Home Server

My home server is the heart of my digital setup. It hosts:

- A media server (Jellyfin)
- Personal files and documents
- Photos and videos (via Immich)
- Various self-hosted services (like Pi-hole, Portainer, etc.)

This is where the **primary copy** of all my data lives.

---

## 2. Local Backup: External SSD with Rsync Script

To maintain a local backup, I’ve connected an **external SSD** directly to my home server.

- The SSD is mounted and automatically recognized on boot.
- I back up **everything important** to this drive using a Bash script powered by `rsync`.
- A cron job or systemd timer can automate the execution of this script regularly.

Here’s a sample of the SSD backup script:

```bash
#!/bin/bash

SOURCE="/data"
DEST="/mnt/backup_ssd"

echo "Starting backup to external SSD..."
mkdir -p "$DEST"
rsync -azP --delete "$SOURCE/" "$DEST/"
echo "Backup to SSD completed."
```

**Here is the actual script of mine. [Github Repo](https://github.com/iashraful/backup-on-disk)**

This makes sure the SSD always has the latest version of my data and also removes deleted files for consistency.

---

## 3. Network Backup: Remote Sync Over SSH with Variables

To fulfill the **offsite** part of the 3-2-1 strategy, I’ve also implemented a **remote backup over my local network**.

Here’s how it works:

- I use a custom Bash script that uses `rsync` over SSH.
- It pulls variables like source, destination, remote user, and host from the script, making it easy to reuse or tweak.

Here’s a sample of the SSH-based backup script:

```bash
#!/bin/bash

SOURCE="/data"
REMOTE_USER="user"
REMOTE_HOST="192.168.1.10"
REMOTE_PATH="/mnt/backup/data"

echo "Starting remote network backup..."
rsync -azP -e ssh "$SOURCE/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo "Remote backup completed."
```

This ensures I’m keeping a secondary backup in a different physical location, even if it's just across the network.

---

## Why This Setup Works for Me

- **Redundancy**: With multiple local and remote backups, I have peace of mind even if one disk fails.
- **Speed**: The SSD makes for quick restores, while SSH syncs avoid re-copying everything unnecessarily.
- **Privacy**: Everything stays in my own network—no cloud involved.

---

## Final Thoughts

Implementing a backup strategy might seem tedious at first, but trust me—it’s worth every bit of effort. Data loss can be painful and costly, especially when it comes to irreplaceable personal content.

By following the **3-2-1 strategy** and using a mix of **external SSDs** and **network-based backups**, I’ve built a system that’s simple, reliable, and tailored to my setup. If you’re running a home server, I highly recommend investing time in your own backup plan—your future self will thank you.
