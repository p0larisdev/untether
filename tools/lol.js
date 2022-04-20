`
Bye bye, ROP...
Now we have JavaScript code execution in racoon.

From now on, all of our doings should be possible from within JSC,
ROP should no longer be an issue.

We have a pretty stable arbitrary memory r/w primitive, which I believe
should be able to facilitate creation of an arbitrary call primitive, 
at which point ROP is basically *actually* done for.

  with love from spv. <3
`

//write_u32(0x41414141, 0x42424242);