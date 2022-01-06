# automated script to clean dist folder then transpile

# clear old build files
sudo rm -rf ./dist/

# node package execute (npx) removes need for global tsc install
npx tsc -p .
