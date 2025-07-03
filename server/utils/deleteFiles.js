const fs = require('fs');
const path = require('path');

exports.deleteFilesFromPath = (paths = []) => {
  const basePath = path.join(process.cwd(), `file_manager`);

  paths.forEach(p => {
    const fullPath = path.join(basePath, p);
    console.log(fullPath);
    fs.promises.unlink(fullPath)
      .then(() => console.log(`Deleted file: ${fullPath}`))
      .catch(err => console.error(`Error deleting file: ${fullPath}`, err));
  });
}
