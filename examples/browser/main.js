
import { saveAs } from 'file-saver'
import './style.css'

const { FilingBrowserWorker } = window.filing

console.log('ArchiveWebWorker', FilingBrowserWorker)

const wasmUrl = window.location.origin + '/static/archive.wasm'

const filing = new FilingBrowserWorker({
  wasmUrl,
})

const fileInput = document.getElementById('file');

fileInput.addEventListener('change', async (e) => {
  const [file] = e.target.files;

  // console.log('file', file);

  const files = await filing.extract(file)
  files.forEach((info) => {
    saveAs(info.file, info.pathname)
  })
  console.log('files', files)
})
