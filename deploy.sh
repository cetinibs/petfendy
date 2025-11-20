#!/bin/bash

# Petfendy Deployment Script
# This script automates the deployment process for Petfendy

set -e  # Exit on error

echo "🐾 Petfendy Deployment Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}Error: .env.local file not found!${NC}"
    echo "Please create .env.local based on .env.example"
    echo "Run: cp .env.example .env.local"
    exit 1
fi

# Function to display menu
show_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Docker Compose (Production)"
    echo "2) Build and run locally"
    echo "3) Build Docker image only"
    echo "4) Stop all containers"
    echo "5) View logs"
    echo "6) Exit"
    echo ""
}

# Function to deploy with Docker Compose
deploy_docker() {
    echo -e "${YELLOW}Building and deploying with Docker Compose...${NC}"

    # Stop existing containers
    docker-compose down 2>/dev/null || true

    # Build and start
    docker-compose up -d --build

    echo -e "${GREEN}✓ Deployment complete!${NC}"
    echo "Application is running at: http://localhost:3000"
    echo "To view logs: docker-compose logs -f"
}

# Function to build locally
build_local() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install --legacy-peer-deps

    echo -e "${YELLOW}Building application...${NC}"
    npm run build

    echo -e "${GREEN}✓ Build complete!${NC}"
    echo "To start: npm start"

    read -p "Start the application now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm start
    fi
}

# Function to build Docker image
build_image() {
    echo -e "${YELLOW}Building Docker image...${NC}"
    docker build -t petfendy:latest .
    echo -e "${GREEN}✓ Image built successfully!${NC}"
    echo "To run: docker run -p 3000:3000 --env-file .env.local petfendy:latest"
}

# Function to stop containers
stop_containers() {
    echo -e "${YELLOW}Stopping all containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Containers stopped${NC}"
}

# Function to view logs
view_logs() {
    echo -e "${YELLOW}Viewing logs (Ctrl+C to exit)...${NC}"
    docker-compose logs -f
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-6]: " choice

    case $choice in
        1)
            deploy_docker
            ;;
        2)
            build_local
            ;;
        3)
            build_image
            ;;
        4)
            stop_containers
            ;;
        5)
            view_logs
            ;;
        6)
            echo "Goodbye! 🐾"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac
done
