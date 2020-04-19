// configure the DAY to import -
const dateStr = '13.4';
const isArchive = true;

const baseFolder = '/אולפני קורונה/הקלטות לשיבוץ לוח השידוריםARCHIVE/DATE/';
const archivePath = '/ארכיון';

const config = require('./config.json');
const limitFolders = -1;

// supress Kaltura console messages -
class CustomKalturaLogger {
	log(msg) {}
	error(msg) {}
	debug(msg) {}
}
const klogger = new CustomKalturaLogger();

var fetch = require('isomorphic-fetch'); //required for dorpbox client
var Dropbox = require('dropbox').Dropbox;
// Get the temporary accessToken from https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder
// Or implement a propoer OAuth handshake
var dbx = new Dropbox({ 
    accessToken: config.dropboxToken, 
    fetch: fetch 
  });
const kaltura = require('kaltura-client');
const kconfig = new kaltura.Configuration();
kconfig.setLogger(klogger);
kconfig.serviceUrl = config.serviceUrl;
const client = new kaltura.Client(kconfig);
const secret = config.secret;
const userId = "DropboxImportScript";
const type = kaltura.enums.SessionType.USER;
const partnerId = config.partnerId;
const expiry = 86400;
const privileges = 'appid:DropboxImportScript';

const archiveStr = (isArchive == false) ? '' : archivePath;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getAllDayStudioFolders() {
  const dbFolders = [];
  var fullPath = baseFolder.replace('ARCHIVE', archiveStr);
  fullPath = fullPath.replace('DATE', dateStr);
  const dbEntries = await dbx.filesListFolder({path: fullPath}).catch((e) => {console.error('\n*******\nDropbox Error: ' + e.error.error_summary + '\n*******\n');}); 
  var i = 0;
  for (const dbFile of dbEntries.entries) {
    if (limitFolders > -1 && i >= limitFolders) break;
    if (dbFile['.tag'] == "folder")
      dbFolders.push(dbFile.path_lower);
    i += 1;
  }
  dbFolders.sort();
  return new Promise(resolve => {resolve(dbFolders);});
}

async function getAllStudioFiles(studiosArr) {
  const dbFiles = [];
  for (const studioPath of studiosArr) {
    console.log('Get list of files for: ' + studioPath);
    const dbEntries = await dbx.filesListFolder({path: studioPath}); 
    for (const dbFile of dbEntries.entries) {
      dbFiles.push(dbFile);
    }
  }
  return new Promise(resolve => {resolve(dbFiles);});
}

async function createAllShareLinks(dpFiles) {
  const kalturaEntries = [];
  for (const dpFile of dpFiles) {
    console.log('Create share link for: ' + dpFile.path_lower);
    await dbx.sharingCreateSharedLinkWithSettings(
      {
        path: dpFile.path_lower,
        "settings": {
          "requested_visibility": {
              ".tag": "public"
          }
        } 
      //}).catch((e) => {console.error(e.error.error_summary);});
      }).catch((e) => {});
    const dbShareLink = await dbx.sharingListSharedLinks(
      {
        "path": dpFile.path_lower,
        "direct_only": true
      }).catch((e) => {});
    var link = dbShareLink.links[0].url;
    const firstPart = link.split("=")[0];
    const linkParts = dpFile.path_lower.split("/");
    var studioName = linkParts[linkParts.length-2];
    link = firstPart + '=1';
    const entryName = "Aired: " + dateStr + " on " + studioName + " at " + dbShareLink.links[0].name.replace(/\.[^/.]+$/, "");
    const kentry = new kaltura.objects.MediaEntry({
      mediaType: kaltura.enums.MediaType.VIDEO,
      name: entryName,
      referenceId: link
    });
    kalturaEntries.push(kentry);
  }
  return new Promise(resolve => {resolve(kalturaEntries);});
}

async function createKalturaEntries(kalturaEntries) {
  var createdEntries = [];
  for (const kEntry of kalturaEntries) {
    const createdEntry = await kaltura.services.media.add(kEntry).execute(client);
    createdEntries.push(createdEntry);
    var resource = new kaltura.objects.UrlResource();
    resource.url = kEntry.referenceId;
    await kaltura.services.media.addContent(createdEntry.id, resource).execute(client);
    console.log('Created Kaltura Entry: ' + createdEntry.id + ', ' + createdEntry.name);
  }
  return new Promise(resolve => {resolve(createdEntries);});
}

async function main (){
  const ks = await kaltura.services.session.start(secret, userId, type, partnerId, expiry, privileges).execute(client);
  client.setKs(ks);
  console.log(ks);
  const dayListOfStudiosFolders = await getAllDayStudioFolders();
  const allStudiosFiles = await getAllStudioFiles(dayListOfStudiosFolders);
  const kalturaEntries = await createAllShareLinks(allStudiosFiles);
  await sleep(3000); //dropbox oddly sometimes needs a bit of time for sharelinks to be valid
  const createdKEntries = await createKalturaEntries(kalturaEntries);
  console.log('Done!');
}

main();