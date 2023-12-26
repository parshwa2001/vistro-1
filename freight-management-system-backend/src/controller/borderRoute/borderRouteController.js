const db = require("../../model");
const errorResponce = require("../../responses/ErrorResponce");
const successResponce = require("../../responses/successResponce");

const borders = db.border;

// Controller functions for managing routes and borders
const routeController = {
  // Create a new route with borders
  createRoute: async (req, res) => {
    try {
      const {
        route_name,
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
        border,
        borderId,
      } = req.body;

      // Create the route
      const newRoute = await db.border_Routes.create({
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
        route_name,
        borderId,
      });

      // Add borders to the route
      // if (border && border.length > 0) {
      //   const routeBorders = await Promise.all(
      //     border.map(async (Newborder) => {
      //       const createdBorder = await borders.create(Newborder);
      //       return createdBorder;
      //     })
      //   );

      //   // await newRoute.addRouteBorders(routeBorders);
      // }

      successResponce(res , "border_Routes created successfully" , newRoute , 201)
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error"  , error : error});
    }
  },

  getAllBorder : async (req , res)=>{
    db.border.belongsTo(db.countries, { foreignKey: "country_id" });
    try {
      const routes = await db.border.findAll({
        include: [
          {model : db.countries,
          attributes : ["country_name"]
          }
        ],
      });
      successResponce(res , "border" , routes , 201  )
    } catch (error) {
      errorResponce(res , 500 , error , "internal server error")
    }

  },
  // Get all routes with borders
  getAllRoutes: async (req, res) => {
    db.border_Routes.belongsTo(db.border, { foreignKey: "borderId" });
    db.border_Routes.belongsTo(db.countries, { foreignKey: "originCountry" });
    db.border_Routes.belongsTo(db.countries, {
      foreignKey: "destinationCountry",
    });
    db.border_Routes.belongsTo(db.states, { foreignKey: "originState" });
    db.border_Routes.belongsTo(db.states, { foreignKey: "destinationState" });
    db.border_Routes.belongsTo(db.citys, { foreignKey: "originCity" });
    db.border_Routes.belongsTo(db.states, { foreignKey: "destinationCity" });

    try {
      const routes = await db.border_Routes.findAll({
        include: [
          {
            model: db.border,
            attributes: ["border_name"],
          },
          {model : db.countries,
          attributes : ["country_name"]
          }
        ],
      });

      res.status(200).json({ success: true, routes });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  // Get a route by ID with borders
  getRouteById: async (req, res) => {
    try {
      const { id } = req.params;

      const route = await db.border_Routes.findByPk(id);

      if (!route) {
        return res
          .status(404)
          .json({ success: false, message: "border_Routes not found" });
      }

      res.status(200).json({ success: true, route });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  // Update a route by ID
  updateRouteById: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
        borders,
      } = req.body;

      const route = await border_Routes.findByPk(id);

      if (!route) {
        return res
          .status(404)
          .json({ success: false, message: "border_Routes not found" });
      }

      // Update route details
      await route.update({
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
      });

      // Update borders
      if (borders && borders.length > 0) {
        // Delete existing borders
        await route.removeRouteBorders(route.routeBorders);

        // Create and associate new borders
        const routeBorders = await Promise.all(
          borders.map(async (border) => {
            const createdBorder = await borders.create(border);
            return createdBorder;
          })
        );

        await route.addRouteBorders(routeBorders);
      }

      res
        .status(200)
        .json({ success: true, message: "border_Routes updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  // Delete a route by ID
  deleteRouteById: async (req, res) => {
    try {
      const { id } = req.params;

      const route = await border_Routes.findByPk(id);

      if (!route) {
        return res
          .status(404)
          .json({ success: false, message: "border_Routes not found" });
      }

      // Delete associated borders
      await route.removeRouteBorders(route.routeBorders);

      // Delete the route
      await route.destroy();

      res
        .status(200)
        .json({ success: true, message: "border_Routes deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  createBorder: async (req, res) => {
    try {
      const newBorder = await db.border.create(req.body);
      successResponce(res, "new border added", newBorder, 201);
    } catch (error) {
      errorResponce(res, 500, error, "");
    }
  },
};

module.exports = routeController;
