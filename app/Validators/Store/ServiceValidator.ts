import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ServiceValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter

  public schema = schema.create({
    storeId: schema.string.optional(),
    category: schema.string.optional(),
    serviceData: schema.object.optional().members({
      gasStation: schema.object.optional().members({
        groceryStore: schema.boolean.optional(),
        foodCourt: schema.boolean.optional(),
        restArea: schema.boolean.optional(),
        parkingFacility: schema.boolean.optional(),
        oilChange: schema.boolean.optional(),
        tyreChange: schema.boolean.optional(),
        café: schema.boolean.optional(),
        truckWaterChange: schema.boolean.optional(),
        truckWash: schema.boolean.optional(),
        vendingMachines: schema.boolean.optional(),
        noOfVendingMachines: schema.number.optional([rules.range(1, 100)]),
        petrolTypesSold: schema.array.optional().anyMembers(),
        typeMostlyBoughtByDriver: schema.array.optional().anyMembers(),
        priceOfTheListedPetrolTypes: schema.array.optional().anyMembers(),
        noOfPumpsPerPetrolType: schema.array.optional().anyMembers(),
      }),
      tyreShopsAndAutoRepairs: schema.object.optional().members({
        batteryChange: schema.boolean.optional(),
        oilChange: schema.boolean.optional(),
        tyreChange: schema.boolean.optional(),
        truckWash: schema.boolean.optional(),
        roadAssistance: schema.boolean.optional(),
        otherServices: schema.array.optional().anyMembers(),
        availableTyreBrandsWithTheStore: schema.array.optional().anyMembers(),
        tyreCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        sellingPriceOfListedTyres: schema.array.optional().anyMembers(),
        availableBatteriesBrandsWithTheStore: schema.array.optional().anyMembers(),
        batteriesCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        sellingPriceOfListedBatteries: schema.array.optional().anyMembers(),
        typesOfLubricantBrandsAvailableAtTheStore: schema.array.optional().anyMembers(),
        LubricantsCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        PackSize: schema.array.optional().anyMembers(),
        sellingPriceOfListedLubricants: schema.array.optional().anyMembers(),
      }),
      auto_repair: schema.object.optional().members({
        batteryChange: schema.boolean.optional(),
        oilChange: schema.boolean.optional(),
        tyreChange: schema.boolean.optional(),
        truckWash: schema.boolean.optional(),
        roadAssistance: schema.boolean.optional(),
        otherServices: schema.array.optional().anyMembers(),
        availableTyreBrandsWithTheStore: schema.array.optional().anyMembers(),
        tyreCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        sellingPriceOfListedTyres: schema.array.optional().anyMembers(),
        availableBatteriesBrandsWithTheStore: schema.array.optional().anyMembers(),
        batteriesCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        sellingPriceOfListedBatteries: schema.array.optional().anyMembers(),
        typesOfLubricantBrandsAvailableAtTheStore: schema.array.optional().anyMembers(),
        LubricantsCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        PackSize: schema.array.optional().anyMembers(),
        sellingPriceOfListedLubricants: schema.array.optional().anyMembers(),
      }),
      lubricant: schema.object.optional().members({
        batteryChange: schema.boolean.optional(),
        oilChange: schema.boolean.optional(),
        tyreChange: schema.boolean.optional(),
        truckWash: schema.boolean.optional(),
        roadAssistance: schema.boolean.optional(),
        otherServices: schema.array.optional().anyMembers(),
        availableTyreBrandsWithTheStore: schema.array.optional().anyMembers(),
        tyreCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        sellingPriceOfListedTyres: schema.array.optional().anyMembers(),
        availableBatteriesBrandsWithTheStore: schema.array.optional().anyMembers(),
        batteriesCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        sellingPriceOfListedBatteries: schema.array.optional().anyMembers(),
        typesOfLubricantBrandsAvailableAtTheStore: schema.array.optional().anyMembers(),
        LubricantsCommonlyPurchasedByDriversFromThisStore: schema.array.optional().anyMembers(),
        PackSize: schema.array.optional().anyMembers(),
        sellingPriceOfListedLubricants: schema.array.optional().anyMembers(),
      }),
      restaurant: schema.object.optional().members({
        cuisineType: schema.array.optional().anyMembers(),
        parkingFacility: schema.boolean.optional(),
        restArea: schema.boolean.optional(),
        noOfVendingMachines: schema.number.optional(),
        vendingMachines: schema.boolean.optional(),
        otherServices: schema.array.optional().anyMembers(),
      }),
      café: schema.object.optional().members({
        cuisineType: schema.array.optional().anyMembers(),
        parkingFacility: schema.boolean.optional(),
        restArea: schema.boolean.optional(),
        noOfVendingMachines: schema.number.optional(),
        vendingMachines: schema.boolean.optional(),
        otherServices: schema.array.optional().anyMembers(),
      }),
      groceryStores: schema.object.optional().members({
        mobileRechargeFacility: schema.boolean.optional(),
        vendingMachines: schema.boolean.optional(),
        otherServices: schema.array.optional().anyMembers(),
        restArea: schema.boolean.optional(),
        noOfVendingMachines: schema.number.optional(),
      }),
      driverParking: schema.object.optional().members({
        type: schema.enum.optional(['paid', 'free']),
      }),
      restAreas: schema.object.optional().members({
        type: schema.enum.optional(['paid', 'free']),
      }),
      forexExchangeHouses: schema.object.optional().members({
        exchangeRateProvided: schema.array.optional().anyMembers(),
        otherServices: schema.array.optional().anyMembers(),
      }),
      laborCamp: schema.object.optional().members({
        name: schema.string.optional(),
      }),
    }),
  })

  public messages = this.ctx.i18n.validatorMessages('validation.store')
}
