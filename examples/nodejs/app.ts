import { FilingNodeJS } from '../../src/nodejs'
import fs from 'fs'
import path from 'path'



(async() => {
    const filepath7z = path.resolve(__dirname, './files/Desktop.7z')
    const filepathRar = path.resolve(__dirname, './files/Desktop.rar')
    const filepathZip = path.resolve(__dirname, './files/Desktop.rar')
    const buffer7z = fs.readFileSync(filepath7z)
    const bufferRar = fs.readFileSync(filepathRar)
    const bufferZip = fs.readFileSync(filepathZip)
    const filing = new FilingNodeJS()
    const files7z = await filing.extract(buffer7z)
    const filesRar = await filing.extract(bufferRar)
    const filesZip = await filing.extract(bufferZip)
    console.log('files7z:', files7z)
    console.log('filesRar:', filesRar)
    console.log('filesZip:', filesZip)
})()