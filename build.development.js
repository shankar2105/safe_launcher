import fse from 'fs-extra';
import path from 'path';

const build = () => {
  const srcDir = 'app';
  const destDir = 'dist';
  const filesToMove = [
    'ffi/libsafe_core.dylib',
    'server',
    'logger',
    'ui/images',
    'app.html'
  ];
  let filePath = null;
  for (filePath of filesToMove) {
    fse.copySync(path.resolve('.', srcDir, filePath), path.resolve('.', destDir, filePath));
  }
};

build();
