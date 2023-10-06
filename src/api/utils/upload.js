const fs = require('fs')
const path = require('path')
const axios = require('axios')
const multer = require('multer')
const mime = require('mime-types')
const download = require('download')
const { supportedTypes, tinifyAPIKey, BToMB, fileSizeLimit } = require('../../config/vars')
const { ipfsToUrl } = require('../utils/ipfs-url')
const uploadsDir = './src/uploads/'

const tempDir = `${uploadsDir}temp/`
const imagesDir = `${uploadsDir}images/`
const audiosDir = `${uploadsDir}audios/`
const compressedDir = `${uploadsDir}compressed/`
const discDir = `${uploadsDir}discs/`
const databasesDir = `${uploadsDir}databases/`
const emailsDir = `${uploadsDir}emails/`
const execDir = `${uploadsDir}exec/`
const pptsDir = `${uploadsDir}ppts/`
const webDir = `${uploadsDir}web/`
const fontsDir = `${uploadsDir}fonts/`
const codesDir = `${uploadsDir}codes/`
const spreadsheetsDir = `${uploadsDir}spreadsheets/`
const systemDir = `${uploadsDir}system/`
const videosDir = `${uploadsDir}videos/`
const docsDir = `${uploadsDir}docs/`
const miscellaneousDir = `${uploadsDir}others/`

const tinify = require('tinify')
tinify.key = tinifyAPIKey

const directoryTypes = [
    {
        name: "images",
        mediaType: 1,
        dir: imagesDir,
        types: ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg'],
    },
    {
        name: "audios",
        mediaType: 2,
        dir: audiosDir,
        types: ['mp3', 'ogg', 'wav'],
    },
    {
        name: "compressed",
        mediaType: 3,
        dir: compressedDir,
        types: ['arj', '7z', 'deb', 'pkg', 'rar', 'rpm', 'tar.gz', 'gz', 'tar', 'z', 'zip'],
    },
    {
        name: "discs",
        mediaType: 4,
        dir: discDir,
        types: ['bin', 'dmg', 'iso', 'toast', 'vcd'],
    },
    {
        name: "databases",
        mediaType: 5,
        dir: databasesDir,
        types: ['csv', 'dat', 'db', 'dbf', 'log', 'mdb', 'sav', 'sql', 'xml'],
    },
    ,
    {
        name: "emails",
        mediaType: 6,
        dir: emailsDir,
        types: ['email', 'eml', 'emlx', 'msg', 'oft', 'ost', 'pst', 'vcf'],
    },
    {
        name: "exec",
        mediaType: 7,
        dir: execDir,
        types: ['apk', 'bat', 'com', 'exe', 'gadget', 'jar', 'wsf'],
    },
    {
        name: "web",
        mediaType: 8,
        dir: webDir,
        types: ['asp', 'aspx', 'cer', 'crt', 'cfm', 'css', 'html', 'htm', 'jsp', 'part', 'rss', 'xhtml'],
    },
    {
        name: "ppts",
        mediaType: 9,
        dir: pptsDir,
        types: ['key', 'odp', 'pps', 'ppt', 'pptx'],
    },
    {
        name: "fonts",
        mediaType: 10,
        dir: fontsDir,
        types: ['fnt', 'fon', 'otf', 'ttf'],
    },
    {
        name: "codes",
        mediaType: 11,
        dir: codesDir,
        types: ['c', 'cgi', 'pl', 'class', 'cpp', 'cs', 'h', 'java', 'php', 'py', 'sh', 'swift', 'vb', 'js'],
    },
    {
        name: "spreadsheets",
        mediaType: 12,
        dir: spreadsheetsDir,
        types: ['ods', 'xls', 'xlsm', 'xlsx'],
    },
    {
        name: 'system',
        mediaType: 13,
        dir: systemDir,
        types: ['bak', 'cab', 'cfg', 'cpl', 'cur', 'dll', 'dmp', 'drv', 'icns', 'ini', 'lnk', 'msi', 'sys', 'tmp'],
    },
    {
        name: "videos",
        mediaType: 14,
        dir: videosDir,
        types: ['3g2', '3gp', 'm4v', 'mkv', 'mov', 'mp4'],
    },
    {
        name: "docs",
        mediaType: 15,
        dir: docsDir,
        types: ['doc', 'docx', 'odt', 'pdf', 'rtf', 'tex', 'txt', 'wpd'],
    },
    {
        name: "others",
        mediaType: 16,
        dir: miscellaneousDir,
        types: ['psd', 'ai', 'ps', 'tif', 'tiff'],
    }

]
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // make uploads directory if do not exist
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir)
        }

        // create other directories
        for (let i in directoryTypes) {
            if (!fs.existsSync(directoryTypes[i].dir)) {
                fs.mkdirSync(directoryTypes[i].dir)
            }
        }
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.match(/\.([^\.]+)$/)[1]
        let dir = ''
        for (let i in directoryTypes) {
            if (directoryTypes[i].types.includes(fileExtension)) {
                dir = directoryTypes[i].name
            }
        }
        if (!supportedTypes.includes(fileExtension)) {
            return cb(new Error('File Type not allowed'))
        }

        cb(null, dir + '/' + Date.now() + '.' + fileExtension)
    }
})
const upload = multer({ storage })
exports.cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }])
exports.createNftUploads = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }])
exports.csvUpload = upload.single('csv')
exports.uploadSingle = upload.single('image')
exports.uploadContentImage = upload.single('files')
exports.collectionUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'featuredImg', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
exports.profileUpload = upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'badgeImage', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }])
exports.categoryUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
exports.planUpload = upload.fields([{ name: 'logo', maxCount: 1 }])

// ipfs
const { create, urlSource } = require('ipfs-http-client')
const { ipfsConfig, ipfsBaseUrl } = require('../../config/vars')
const ipfs = create(ipfsConfig)

exports.addImage = async (data) => {
    const fileAdded = await ipfs.add(data)
    const imgHash = (fileAdded.cid).toString()
    return `${ipfsBaseUrl}${imgHash}`
}

exports.addContent = async (data) => {
    const doc = JSON.stringify(data);
    const dataAdded = await ipfs.add(doc);
    const dataHash = (dataAdded.cid).toString()
    return `${ipfsBaseUrl}${dataHash}`
}

// method to download remote file on server and give it's name, path & media type in return
exports.downloadFile = async (remoteFile, checkFileSize = false) => {
    try {
        // make uploads directory if does not exist
        if (!fs.existsSync(uploadsDir))
            fs.mkdirSync(uploadsDir)

        // make temp directory temporarily to store downloaded file in it
        if (!fs.existsSync(tempDir))
            fs.mkdirSync(tempDir)

        remoteFile = await ipfsToUrl(remoteFile)

        const remoteFileDetails = await getRemoteFileDetails(remoteFile)

        if (!remoteFileDetails)
            return { success: false, message: 'File details not found', downloadFileErr: true }

        // check file size (only if content length is found inn request resp. headers) - if greater than 100 MB then return user error message
        // note: don't check file size for integrated / custom NFTs
        if (remoteFileDetails?.contentLength && checkFileSize) {
            const size = parseFloat((parseFloat(remoteFileDetails?.contentLength) * BToMB).toFixed(10))
            if (size > fileSizeLimit)
                return { success: false, message: 'File size is too large! File size should be less than or equal to 100 MB', downloadFileErr: true, size }
        }

        const tempFilePath = path.resolve(path.join(`${tempDir}${Date.now()}`))
        await download(remoteFile, tempFilePath)

        let originalFilename = '', fileExtension = ''
        // get downloaded file from temp. directory
        const files = fs.readdirSync(tempFilePath)
        if (files?.length) {
            originalFilename = files[0]
            fileExtension = (files[0]).split('.').pop() || ''
        }

        // get file extension if not found from downloaded file name
        if (!fileExtension && remoteFileDetails?.fileExtension)
            fileExtension = remoteFileDetails.fileExtension

        if (!supportedTypes.includes(fileExtension)) {
            // remove temp. directory 'cause it's not needed anymore
            fs.rmSync(tempFilePath, { recursive: true, force: true });
            return { success: false, message: 'File type not allowed', downloadFileErr: true, fileExtension }
        }

        // get directory acc. to file extension
        let dest = '', dirName = '', mediaType = 0
        for (let i in directoryTypes)
            if (directoryTypes[i].types.includes(fileExtension)) {
                dest = directoryTypes[i].dir
                dirName = directoryTypes[i].name
                mediaType = directoryTypes[i].mediaType
            }

        // make required file directory if does not exist
        if (!fs.existsSync(dest))
            fs.mkdirSync(dest)

        const newFilename = `${Date.now()}.${fileExtension}`
        const newFilePath = path.resolve(path.join(dest))

        // move downloaded file to required destination
        const downloadedFile = `${tempFilePath}/${originalFilename}`
        const newFile = `${newFilePath}/${newFilename}` // file to rename with
        fs.renameSync(downloadedFile, newFile)

        // remove temp. directory 'cause it's not needed anymore
        // fs.rmSync(tempFilePath, { recursive: true, force: true });

        // compressing image and saving to server
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png')
            await tinify.fromFile(newFile).toFile(newFile)

        return {
            filename: `${dirName}/${newFilename}`,
            mediaType
        }
    } catch (error) {
        return { success: false, message: 'Unable to download remote file', downloadFileErr: true }
    }
}

exports.uploadCompressRemove = async (oldPath, path, fileExt) => {
    const compress = await compressFile(path, fileExt);
    const remove = await removeOldFiles(oldPath)
    return compress && remove;
}

const compressFile = async (imgPath, fileExt) => {
    try {
        if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png') {
            imgPath = `./src/uploads/${imgPath}`
            imgPath = path.resolve(path.join(imgPath))
            let result = await tinify.fromFile(imgPath).toFile(imgPath);
            if (result)
                return true
            else
                return false
        }
        else
            return false

    } catch (e) {
        console.log('Err while compressing file: ', e)
    }
}

const removeOldFiles = async (oldImagePath) => {
    try {
        oldImagePath = `./src/uploads/${oldImagePath}`
        oldImagePath = path.resolve(path.join(oldImagePath))
        if (oldImagePath) {
            fs.unlinkSync(oldImagePath, function (err) {
                if (err) {
                    console.log("Error while removing", err)
                    return false
                }
                else {
                    return true
                }
            })
        }
        else {
            return false
        }

        return true


    } catch (e) {
        console.log(e)
    }
}

exports.compressFile = compressFile;

// method to get remote file details, like content type and content length etc.
const getRemoteFileDetails = async (remoteFile) => {
    try {
        if (remoteFile) {
            const result = await axios.get(remoteFile)
            const contentLength = result.headers['content-length'] || ''
            const contentType = result.headers['content-type'] || ''
            const fileExtension = await mime.extension(contentType) || ''

            return {
                contentLength,
                contentType,
                fileExtension
            }
        }
    } catch (e) {
        console.log('Error while fetching file details')
        return false
    }
}

// upload data on IPFS
exports.uploadOnIPFS = async (data) => {
    try {
        if (data) {
            data = await ipfsToUrl(data)
            const file = await ipfs.add(urlSource(data))
            return `${ipfsBaseUrl}${String(file.cid)}`
        }
    } catch (error) {
        return { ipfsErr: true, message: error?.message }
    }
}

exports.directoryTypes = directoryTypes