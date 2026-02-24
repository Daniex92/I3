@echo off
REM RAÍZ E-commerce Setup Script for Windows
REM Automated initialization in 5 minutes

echo.
echo 🌿 RAIZ E-commerce - Setup Wizard
echo ==================================
echo.

REM 1. Install Backend Dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM 2. Setup Environment
echo.
echo ⚙️ Setting up environment...
copy .env.example .env
echo   ✓ Created .env file
echo   📝 IMPORTANT: Edit backend\.env with your MySQL credentials

REM 3. Instructions
echo.
echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Edit backend\.env with your MySQL credentials
echo 2. Update FORMSPREE_ENDPOINT with your form ID
echo 3. Run: npm run init-db (to initialize database)
echo 4. Run: npm start (to start backend server)
echo 5. Open frontend\index.html in your browser
echo.
echo 🌐 Access Points:
echo   Backend API: http://localhost:3000
echo   Frontend: Open frontend/index.html
echo.
echo 🔐 Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
