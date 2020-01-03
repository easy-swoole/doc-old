---
title: PSR-7
meta:
  - name: description
    content: easyswoole,Easyswoole is fully compatible with PSR7 Http Message Interface Specification
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|PSR7
---

#PSR-7 Http Message
Easyswoole is fully compatible with the PSR7 Http Message interface specification.
## Interface Specification Example
[http://www.php-fig.org/psr/psr-7/](http://www.php-fig.org/psr/psr-7/)

## Part of the object detailed
### Stream Object
easySwoole uses php://memory to implement Stream object, (newbie can understand Stream as a string object), all operations are binary security, and completely memory IO, so the efficiency is very high, not due to disk IO problem Affects execution speed.
   - __toString
   Returns the complete stream data in the Stream object.
   - close
   The current stream object is closed, and the data in the stream object is also cleared.
   - detach
   The resources (file stream handles) in the stream object are extracted from the Stream object.
        > Note: After the extraction, the Stream object will no longer be unavailable.
   - getSize
   Gets the size (length) of the data in the current Stream object.
   - tell
   Get the location of the current stream pointer.
   - eof
   Determine if the data stream pointer is at the end of the resource.
   - isSeekable
   - seek
   Move the data stream pointer to the specified location.
   - rewind
   Move the data stream pointer to the starting position.
   - isWritable
   - write
   Write data to the current data stream.
        > Note: You should pay attention to the location of the data stream pointer when writing.
   - isReadable
   - read
   - getContents
   - getMetadata
   
### UploadFile object
In easySwoole, all files are automatically converted to an UploadFile object.
   - getStream
        Returns the data stream of the uploaded file.
   - moveTo
        Save the uploaded file as an entity file.
             >Note: moveTo is implemented as file_put_contents, so make sure that the file storage path already exists and has write access when saving the file.
   - getSize
        Get the file size.
   - getError
        Get the error message when the file is uploaded.
   - getClientFilename
        Get the client file name of the file.
   - getClientMediaType
   
