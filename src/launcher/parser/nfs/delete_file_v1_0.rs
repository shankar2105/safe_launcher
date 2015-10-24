// Copyright 2015 MaidSafe.net limited.
//
// This SAFE Network Software is licensed to you under (1) the MaidSafe.net Commercial License,
// version 1.0 or later, or (2) The General Public License (GPL), version 3, depending on which
// licence you accepted on initial access to the Software (the "Licences").
//
// By contributing code to the SAFE Network Software, or to this project generally, you agree to be
// bound by the terms of the MaidSafe Contributor Agreement, version 1.0.  This, along with the
// Licenses can be found in the root directory of this project at LICENSE, COPYING and CONTRIBUTOR.
//
// Unless required by applicable law or agreed to in writing, the SAFE Network Software distributed
// under the GPL Licence is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.
//
// Please review the Licences for the specific language governing permissions and limitations
// relating to use of the SAFE Network Software.

#[derive(RustcDecodable, Debug)]
pub struct DeleteFile {
    file_path     : String,
    is_path_shared: bool,
}

impl ::launcher::parser::traits::Action for DeleteFile {
    fn execute(&mut self, params: ::launcher::parser::ParameterPacket) -> ::launcher::parser::ResponseType {

        let start_dir_key = if self.is_path_shared {
            &params.safe_drive_dir_key
        } else {
            &params.app_root_dir_key
        };

        let mut tokens = ::launcher::parser::helper::tokenise_path(&self.file_path, false);
        let file_name = try!(tokens.pop().ok_or(::errors::LauncherError::InvalidPath));
        let mut dir_of_file = try!(::launcher::parser::helper::get_final_subdirectory(params.client.clone(),
                                                                                      &tokens,
                                                                                      Some(start_dir_key)));

        let file_helper = ::safe_nfs::helper::file_helper::FileHelper::new(params.client);
        let _ = try!(file_helper.delete(file_name,
                                        &mut dir_of_file));

        Ok(None)
    }
}


#[cfg(test)]
mod test {
    use super::*;
    use ::launcher::parser::traits::Action;

    #[test]
    pub fn delete_file() {
        let parameter_packet = eval_result!(::launcher::parser::test_utils::get_parameter_packet(false));

        let file_helper = ::safe_nfs::helper::file_helper::FileHelper::new(parameter_packet.client.clone());
        let dir_helper = ::safe_nfs::helper::directory_helper::DirectoryHelper::new(parameter_packet.client.clone());
        let mut app_root_dir = eval_result!(dir_helper.get(&parameter_packet.app_root_dir_key));
        let writer = eval_result!(file_helper.create("test_file.txt".to_string(),
                                                     Vec::new(),
                                                     app_root_dir));
        let _ = eval_result!(writer.close());

        let mut request = DeleteFile {
            file_path     : "/test_file.txt".to_string(),
            is_path_shared: false,
        };

        app_root_dir = eval_result!(dir_helper.get(&parameter_packet.app_root_dir_key));
        assert_eq!(app_root_dir.get_files().len(), 1);
        assert!(app_root_dir.find_file(&"test_file.txt".to_string()).is_some());
        assert!(request.execute(parameter_packet.clone()).is_ok());
        app_root_dir = eval_result!(dir_helper.get(&parameter_packet.app_root_dir_key));
        assert_eq!(app_root_dir.get_files().len(), 0);
        assert!(request.execute(parameter_packet.clone()).is_err());
    }
}
