#!/bin/bash

# RAÍZ E-commerce Setup Script for macOS/Linux
# Automated initialization in 5 minutes

echo "🌿 RAÍZ E-commerce - Setup Wizard"
echo "=================================="

# 1. Install Backend Dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# 2. Setup Environment
echo ""
echo "⚙️ Setting up environment..."
cp .env.example .env
echo "  ✓ Created .env file"
echo "  📝 IMPORTANT: Edit backend/.env with your MySQL credentials"

# 3. Database Setup
echo ""
echo "🗄️ Running database initialization..."
cp database/schema.sql database/schema.sql.bak
echo "  ✓ Backup created at database/schema.sql.bak"

# 4. Installation Complete
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit backend/.env with your MySQL credentials"
echo "2. Update FORMSPREE_ENDPOINT with your form ID"
echo "3. Run: npm run init-db (to initialize database)"
echo "4. Run: npm start (to start backend server)"
echo "5. Open frontend/index.html in browser"
echo ""
echo "🌐 Access Points:"
echo "  Backend API: http://localhost:3000"
echo "  Frontend: Open frontend/index.html"
echo ""
echo "🔐 Admin Credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
