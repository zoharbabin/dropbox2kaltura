# Import files from Dropbox to Kaltura
This is a very quick & dirty script to import files from Dropbox to Kaltura utilizing dropbox share links.  
This script takes a parent Dropbox folder, then loops through all sub-folders, create a Dropbox share link and then submits an import job for each video to Kaltura.  
 
To run it on your own Dropbox account - Edit app.js, and change the naming logic to suite your own (mostly in `getAllDayStudioFolders`). 

> If you’re just testing things, set limitFolders to a number above 0 to limit the number of sub-folders you'll pull in the test run. This script does not delete, so make sure to go to the KMC and delete any test videos you’ve imported.

# Setup
1. Checkout/Download the files
1. `npm install`
1. Rename `config.json.template` to `config.json`
1. Open `config.json` and configure accordingly:
   * [Kaltura Account details](https://kmc.kaltura.com/index.php/kmcng/settings/integrationSettings)
   * Dropbox API Access Token (Using the [dropbox-api-v2-explorer](https://dropbox.github.io/dropbox-api-v2-explorer/))
1. Open `app.js` and edit the folders path logic

# How you can help (guidelines for contributors) 
Thank you for helping Kaltura grow! If you'd like to contribute please follow these steps:
* Use the repository issues tracker to report bugs or feature requests
* Read [Contributing Code to the Kaltura Platform](https://github.com/kaltura/platform-install-packages/blob/master/doc/Contributing-to-the-Kaltura-Platform.md)
* Sign the [Kaltura Contributor License Agreement](https://agentcontribs.kaltura.org/)

# Where to get help
* Join the [Kaltura Community Forums](https://forum.kaltura.org/) to ask questions or start discussions
* Read the [Code of conduct](https://forum.kaltura.org/faq) and be patient and respectful

# Get in touch
You can learn more about Kaltura and start a free trial at: http://corp.kaltura.com    
Contact us via Twitter [@Kaltura](https://twitter.com/Kaltura) or email: community@kaltura.com  
We'd love to hear from you!

# License and Copyright Information
All code in this project is released under the [AGPLv3 license](http://www.gnu.org/licenses/agpl-3.0.html) unless a different license for a particular library is specified in the applicable library path.   

Copyright © Kaltura Inc. All rights reserved.   
Authors and contributors: See [GitHub contributors list](graphs/contributors).  

### Open Source Libraries
Review the [list of Open Source 3rd party libraries](open-source-libraries.md) used in this project.
