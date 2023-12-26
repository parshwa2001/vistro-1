const { bookings , customers , clients , drivers , driver_documents , vehicles} = require("../../model");
const { Op, Model } = require("sequelize");
const successResponce = require("../../responses/successResponce");
const errorResponce = require("../../responses/ErrorResponce");
const HandleDbErrors = require("../../validators/dbValidation");
const Booking = bookings;
const CommonValidator = require("../../middleware/validators/CommonValidators")
// Create a new booking
const createBooking = async (req, res) => {
  try {
    // let validate =  CommonValidator(req.body , clientSchema) 
    //   if (!validate.validate) {
    //     return errorResponce(res, 422, validate.data , "validation error in Creatbooking fun >>>>>>>>>>>>>>>>>>>>>>>>>>>")
    //   }
    const newBooking = await Booking.create(req.body);
    successResponce(res,"bookins is created" , newBooking , 201)
  } catch (error) {
    HandleDbErrors(error , res , "")
      }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    bookings.belongsTo(customers, { foreignKey: "customer_id" });
    bookings.belongsTo(clients, { foreignKey: "client_id" });
    bookings.belongsTo(drivers, { foreignKey: "driver_id"});
    drivers.belongsTo(driver_documents, { foreignKey: 'driver_id'});


    const booking = await bookings.findAll({
        include: [
            { model: customers  },
            { model: clients,  },
            { model: drivers ,
            include : [
                {model : driver_documents}
            ]
            },
          ],
    });
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  const{id} = req.params.id;
  try {
    
    const booking = await Booking.findByPk(req.params.id);
    if (booking) {
      res.status(200).json(booking);
    } else {
      errorResponce(res , 404 , "" ,  `Booking not found for ${booking_id}` )
      // res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a booking by ID
const updateBookingById = async (req, res) => {
  const { booking_id } = req.params;
  try {
    const [updatedRows] = await Booking.update(req.body, {
      where: { booking_id: booking_id },
    });

    if (updatedRows > 0) {
      res.status(200).json({ message: "Booking updated successfully" });
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a booking by ID
const deleteBookingById = async (req, res) => {
  const { booking_id } = req.params;
  try {
    const deletedRows = await Booking.destroy({
      where: { booking_id: booking_id },
    });

    if (deletedRows > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById,
};
