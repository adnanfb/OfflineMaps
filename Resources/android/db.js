var db = Ti.Database.install("db/Trees.sqlite", "Trees");

exports.methods = {
    getRows: function(sqlQuery) {
        var result = [];
        try {
            var rows = db.execute(sqlQuery);
            if (rows.rowCount > 0) while (rows.isValidRow()) {
                var obj = {};
                for (var i = 0, len = rows.fieldCount; len > i; i++) obj[rows.fieldName(i)] = "null" !== rows.field(i) && rows.field(i) ? rows.field(i) : "";
                result.push(obj);
                rows.next();
            }
            rows.close();
        } catch (err) {
            Ti.API.info("err ==> " + JSON.stringify(err));
        }
        return result;
    },
    getMarkers: function(onSuccessCallback, onErrorCallback, options) {
        var query;
        var genusArr = [ "Abies", "Eucalyptus", "All" ];
        var selectedGenus = genusArr[options.condition];
        switch (selectedGenus) {
          case "All":
            query = "SELECT * FROM trees  WHERE lat!=0 AND lon!=0 limit 10";
            break;

          default:
            query = "SELECT * FROM trees WHERE genus_name = '" + selectedGenus + "' AND lat!=0 and lon!=0  GROUP BY accession_key";
        }
        var result = this.getRows(query);
        result.length > 0 ? onSuccessCallback(result) : onErrorCallback(result);
    }
};