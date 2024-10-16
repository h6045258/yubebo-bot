const mongoose = require("mongoose");

const trungThuSchema = new mongoose.Schema({
    userId: String,
    longdenchongnuoc: { type: Number, default: 0 },
    que: { type: Number, default: 0 },
    giay: { type: Number, default: 0 },
    mau: { type: Number, default: 0 },
    nen: { type: Number, default: 0 },
    bangkeo: { type: Number, default: 0 },
    batlua: { type: Number, default: 0 },
});

const trungThuModel = mongoose.model("trungthu", trungThuSchema);

module.exports = trungThuModel;
