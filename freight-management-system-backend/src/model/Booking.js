module.exports = function (sequelize, DataTypes) {
    const Booking = sequelize.define('bookings', 
    {
      booking_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // Customer Details
        customer_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'customers', // Assuming your States model is defined elsewhere
            key: 'customer_id',
          },
        },
        customerCreditLimit: DataTypes.FLOAT,
        customerCreditUsed: DataTypes.FLOAT,
        customerCreditBalance: {
          type: DataTypes.VIRTUAL,
          get() {
            return this.customerCreditLimit - this.customerCreditUsed;
          },
        },
      
        // Client Details
        client_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'clients', // Assuming your States model is defined elsewhere
            key: 'client_id',
          },

        },
      
        // Route Details
        routeName: DataTypes.STRING,
        routeFare: DataTypes.FLOAT,
        allBordersFare: DataTypes.FLOAT,
        totalAmount: {
          type: DataTypes.VIRTUAL,
          get() {
            return this.routeFare + this.allBordersFare;
          },
        },
      
        // Driver Details
        driver_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'drivers', // Assuming your States model is defined elsewhere
            key: 'driver_id',
          },
        },
        // truckType: DataTypes.STRING,
        // truckRegistrationStatus: DataTypes.STRING,
        // driverPassportStatus: DataTypes.STRING,
        // driverIdCardStatus: DataTypes.STRING,
        // driverLicenseStatus: DataTypes.STRING,
      
        // // Document Details
        // documentExpiryDate: DataTypes.DATE,
      
        // Additional Booking Details
        remarkOnDriver: DataTypes.STRING,
        amountPaidToDriver: DataTypes.FLOAT,
        attitude: DataTypes.STRING,
      },{
        timestamps: true,
        underscored: true,
      });
    return Booking;
  };