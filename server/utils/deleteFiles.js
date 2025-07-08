const fs = require('fs');
const path = require('path');

exports.deleteFilesFromPath = (paths = []) => {
  const basePath = path.join(process.cwd(), `file_manager`);

  paths.forEach(p => {
    const fullPath = path.join(basePath, p);
    fs.promises.unlink(fullPath)
  });
}
