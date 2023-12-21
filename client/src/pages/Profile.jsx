import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(formData);
  console.log(fileUploadError);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    // as we want the percentage of the upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
    setFile(undefined);
  };
  return (
    <div className="flex flex-col p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-3">Profile</h1>
      <input
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <img
        className="rounded-full object-cover h-24 w-24 mx-auto my-7 cursor-pointer"
        src={formData.avatar || currentUser.avatar}
        alt="user"
        onClick={() => fileRef.current.click()}
      />
      <p className="text-sm self-center mb-3">
         {fileUploadError ? (
             <span className="text-red-700">Error uploading file (image must be less than 2mb)</span>
         ) : filePercent > 0 && filePercent < 100 ? (
             <span className="text-slate-700">{`Uploading ${filePercent}`}</span>
         ) : filePercent === 100 ? (
              <span className="text-green-700">File uploaded successfully</span>
         ) : (
            ""
         )}
      </p>
      <form className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="username"
          className="border focus:outline-none p-3 rounded-lg"
          id="username"
          value={currentUser.username}
        />
        <input
          type="text"
          placeholder="email"
          className="border focus:outline-none p-3 rounded-lg"
          id="email"
          value={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border focus:outline-none p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Update
        </button>
        <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Create Listing
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;

// used this code in firebase to store images
// service firebase.storage {
//   7
//     match /b/{bucket}/o {
//   8
//       match /{allPaths=**} {
//   9
//         allow read;
//   10
//         allow write : if
//   11
//         request.resource.size < 2 * 1024 * 1024 &&
//   12
//         request.resource.contentType.matches('image/.*')
//   13
//       }
//   14
//     }
//   15
//   }
