demeteorizer -o .demeteorized

meteor build --directory .demeteorized/android/ --server=http://taf.ogre.be

cd .demeteorized/android/

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 release-unsigned.apk taf
/Developer/android-sdk-mac_x86/build-tools/23.0.2/zipalign 4 release-unsigned.apk production.apk