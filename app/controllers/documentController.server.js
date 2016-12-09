var document= require('../models/document');

function documentController () {
    this.createDocument = function (newDocument, callback){
                newDocument.save(callback);
    };
    
    this.updatedDocument = function ( documentId, newDocument, callback){
      // getListOfBooks(function(err, bookObject){
          console.log(newDocument.id);
             document.findByIdAndUpdate( documentId,{ $set:
                  {
                          "local.title": newDocument.local.title,
                          "local.link": newDocument.local.link,
                          "local.category":newDocument.local.category,
                          "local.keywords":newDocument.local.keywords
                          
                      }
                  }, callback);
    
      
  };

    this.documentDelete = function (documentId, callback) {
           // var query = {"local.bookName": bookName}
            document.findByIdAndRemove(documentId, callback);
        }
    this.getDocumentById = function (id, callback) {
        document.findById(id, callback);
    };
    this.getListOfDocument = function (callback) {
        document.find (callback);
    };
    
}

module.exports = documentController;
