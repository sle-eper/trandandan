#!/bin/bash
# generate-certs.sh - Minimal version

set -e

CERT_DIR="/etc/nginx/certs"
CERT_FILE="$CERT_DIR/certificate.crt"
KEY_FILE="$CERT_DIR/private.key"
CA_FILE="$CERT_DIR/rootCA.pem"

# Check if certificates already exist
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ] && [ -f "$CA_FILE" ]; then
    exit 0
fi

# Set CAROOT for certificate persistence
export CAROOT="$CERT_DIR"

# Install CA and generate certificate
cd "$CERT_DIR"
mkcert -install
mkcert -cert-file certificate.crt -key-file private.key localhost 127.0.0.1 ::1

# Set permissions
chmod 644 "$CERT_FILE"
chmod 600 "$KEY_FILE"
chmod 644 "$CA_FILE"

exit 0