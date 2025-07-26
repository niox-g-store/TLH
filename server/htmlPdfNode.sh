#!/bin/bash

# for centos installs
sudo yum install -y   nss   libXScrnSaver   atk   cups-libs   libdrm   xorg-x11-server-Xvfb   libXrandr   GConf2   alsa-lib   gtk3   xorg-x11-fonts-100dpi   xorg-x11-fonts-75dpi   xorg-x11-utils   xorg-x11-fonts-cyrillic   xorg-x11-fonts-Type1   xorg-x11-fonts-misc;

# for file manager preparations
mkdir file_manager/uploads/gallery file_manager/uploads/events file_manager/uploads/products file_manager/uploads/media file_manager/uploads/profile file_manager/uploads/newsletter;
