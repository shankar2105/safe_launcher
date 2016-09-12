import fse from 'fs-extra';
import os from 'os';
import path from 'path';

const build = () => {
  const srcDir = 'app';
  const destDir = 'dist';

  const LIB_NAME = {
    'darwin': 'libsafe_core.dylib',
    'linux': 'libsafe_core.so',
    'win32': 'safe_core.dll',
  };

  const filesToMove = [
    'server',
    'logger',
    'ui/images',
    'app.html'
  ];
  let filePath = null;
  for (filePath of filesToMove) {
    fse.copySync(path.resolve('.', srcDir, filePath), path.resolve('.', destDir, filePath));
  }
  const libPath = 'ffi/' + (LIB_NAME[os.platform()] || LIB_NAME['linux'])
  fse.copySync(path.resolve('.', srcDir, libPath), path.resolve('.', destDir, libPath));
};

build();
