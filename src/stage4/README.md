# stage4
`stage4` runs still within `racoon`, but is loaded from disk from the path
`/var/root/stage4.js`, which is hard-linked to by `/var/mobile/Media/stage4.js`.
This means that you can modify the contents of `stage4` over AFC/USB, making
development much easier & quicker.