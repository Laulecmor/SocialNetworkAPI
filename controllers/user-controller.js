const { User, Types } = require("../models");


const userCount = async () => {
    const numberofUsers = await User.aggregate ().count("userCount");
    return numberofUsers;
};

module.exports = {
    async getAllUser(req, res) {
        try {
            const users = await User.find();

            const userObj = {
                users,
                userCount: await userCount(),
            };
            res.json(userObj);
        } catch (err){
        console.log(err);
        return res.status(500).json(err);
        }
    }, 

}