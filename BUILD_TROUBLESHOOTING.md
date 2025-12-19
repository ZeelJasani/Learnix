# Build Troubleshooting Guide

## Issues Fixed

### 1. EPERM Permission Errors
**Problem**: `EPERM: operation not permitted, scandir 'C:\Users\ABC\Application Data'`

**Root Cause**: Next.js was trying to scan Windows system directories it doesn't have permission to access.

**Solutions Applied**:
- Updated `next.config.mjs` with Windows-specific watch options
- Added directory exclusions to prevent scanning system folders
- Created Windows-optimized build script (`build-windows.js`)
- Updated `.gitignore` to exclude problematic directories

### 2. Webpack Configuration Issues
**Problem**: `TypeError: Cannot read properties of undefined (reading 'client')`

**Root Cause**: Webpack configuration conflicts with Prisma plugin and undefined properties.

**Solutions Applied**:
- Enhanced webpack configuration in `next.config.mjs`
- Added proper fallbacks for Node.js modules
- Fixed Prisma plugin integration
- Added webpack DefinePlugin for environment variables

### 3. Missing Environment Configuration
**Problem**: Build script couldn't find `.env` file

**Solution**: Created comprehensive `.env` template with all required variables

## Build Commands

### Standard Build
```bash
npm run build
```

### Windows-Optimized Build
```bash
npm run build:windows
```

### Fallback Build
```bash
npm run build:fallback
```

## Troubleshooting Steps

### If Build Still Fails:

1. **Clean Everything**:
   ```bash
   npm cache clean --force
   rm -rf .next
   rm -rf node_modules
   npm install
   ```

2. **Check Environment Variables**:
   - Ensure `.env` file exists and has all required variables
   - Verify database connection string
   - Check API keys are valid

3. **Windows-Specific Fixes**:
   - Run PowerShell as Administrator
   - Add project folder to Windows Defender exclusions
   - Check file permissions on project directory

4. **Alternative Build Methods**:
   ```bash
   # Try minimal build
   npx next build --no-lint --no-mangling --no-optimize
   
   # Try debug build
   npx next build --no-lint --debug
   
   # Try legacy mode
   npx next build --no-lint --experimental-build-mode=compile
   ```

5. **Prisma Issues**:
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   
   # Reset database (if needed)
   npx prisma db push --force-reset
   ```

## Configuration Changes Made

### 1. `next.config.mjs`
- Added Windows-specific watch options
- Enhanced webpack configuration
- Added proper fallbacks for Node.js modules
- Disabled telemetry to prevent permission issues

### 2. `build-with-prisma.js`
- Added multiple build strategies
- Enhanced error handling
- Added Windows-specific environment variables

### 3. `build-windows.js` (New)
- Windows-optimized build script
- Multiple fallback strategies
- Enhanced cleanup process

### 4. `.env` (New)
- Complete environment variable template
- All required variables for the application

### 5. `.gitignore`
- Added Windows system directory exclusions
- Prevented scanning of problematic directories

## Expected Results

After applying these fixes, your build should:
1. ✅ Generate Prisma client successfully
2. ✅ Build Next.js application without permission errors
3. ✅ Handle webpack configuration properly
4. ✅ Complete the build process successfully

## If Issues Persist

1. Check the specific error messages in the terminal
2. Try the Windows-optimized build: `npm run build:windows`
3. Check if all dependencies are properly installed
4. Verify your environment variables are correct
5. Consider running the build in a different directory with proper permissions
