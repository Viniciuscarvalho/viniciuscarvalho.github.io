const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests/browser',
  fullyParallel:true,
  timeout:30000,
  retries:process.env.CI?1:0,
  reporter:'list',
  use:{baseURL:'http://127.0.0.1:4182',viewport:{width:390,height:844},screenshot:'only-on-failure',trace:'retain-on-failure',launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']}:{}},
  webServer:{command:'python3 -m http.server 4182 --bind 127.0.0.1 --directory _site',url:'http://127.0.0.1:4182/card/',reuseExistingServer:false,timeout:15000,stdout:'ignore',stderr:'ignore'},
});
