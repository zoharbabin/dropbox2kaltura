# Import files from Dropbox to Kaltura
Simple script to import files from Dropbox to Kaltura utilizing dropbox share links

# Setup
1. Checkout/Download the files
1. `npm install`
1. Rename `config.json.template` to `config.json`
1. Open `config.json` and configure accordingly:
   * [Kaltura Account details](https://kmc.kaltura.com/index.php/kmcng/settings/integrationSettings)
   * Dropbox API Access Token (Using the [dropbox-api-v2-explorer](https://dropbox.github.io/dropbox-api-v2-explorer/))
1. Open `app.js` and edit the folders path logic
