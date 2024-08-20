import { defineEventHandler, readBody } from 'h3';
import ProductAdvertisingAPIv1 from 'paapi5-nodejs-sdk';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const partnerTag = process.env.AWS_ASSOCIATE_TAG;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const asin = body.asin;

  if (!asin) {
    return { error: 'ASIN is required.' };
  }

  const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
  defaultClient.accessKey = accessKeyId;
  defaultClient.secretKey = secretAccessKey;
  defaultClient.host = 'webservices.amazon.com';
  defaultClient.region = 'us-east-1';

  const api = new ProductAdvertisingAPIv1.DefaultApi();
  const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

  getItemsRequest.PartnerTag = partnerTag;
  getItemsRequest.PartnerType = 'Associates';
  getItemsRequest.ItemIds = [asin];
  getItemsRequest.Condition = 'New';
  getItemsRequest.Resources = [
    'Images.Primary.Small',
    'Images.Primary.Medium',
    'Images.Primary.Large',
    'Images.Variants.Small',
    'Images.Variants.Medium',
    'Images.Variants.Large',
    'ItemInfo.Title',
    'ItemInfo.ByLineInfo',
    'ItemInfo.Classifications',
    'ItemInfo.ContentInfo',
    'ItemInfo.ContentRating',
    'ItemInfo.ExternalIds',
    'ItemInfo.ManufactureInfo',
    'ItemInfo.ProductInfo',
    'ItemInfo.TechnicalInfo',
    'ItemInfo.TradeInInfo',
    'ItemInfo.Features',
    'Offers.Listings.Price',
    'Offers.Listings.Availability.MaxOrderQuantity',
    'Offers.Listings.Availability.Message',
    'Offers.Listings.Availability.MinOrderQuantity',
    'Offers.Listings.Availability.Type',
    'Offers.Listings.Condition',
    'Offers.Listings.Condition.ConditionNote',
    'Offers.Listings.Condition.SubCondition',
    'Offers.Listings.DeliveryInfo.IsAmazonFulfilled',
    'Offers.Listings.DeliveryInfo.IsFreeShippingEligible',
    'Offers.Listings.DeliveryInfo.IsPrimeEligible',
    'Offers.Listings.IsBuyBoxWinner',
    'Offers.Listings.LoyaltyPoints.Points',
    'Offers.Listings.MerchantInfo',
    'Offers.Listings.ProgramEligibility.IsPrimeExclusive',
    'Offers.Listings.ProgramEligibility.IsPrimePantry',
    'Offers.Listings.Promotions',
    'Offers.Listings.SavingBasis',
    'Offers.Summaries.HighestPrice',
    'Offers.Summaries.LowestPrice',
    'Offers.Summaries.OfferCount'
  ];

  try {
    const data = await new Promise((resolve, reject) => {
      api.getItems(getItemsRequest, (error, data) => {
        if (error) {
          console.error('API Error:', error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });

    console.log("Full API Response Data:", JSON.stringify(data, null, 2));

    const getItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);

    if (getItemsResponse.ItemsResult && getItemsResponse.ItemsResult.Items.length > 0) {
      const item = getItemsResponse.ItemsResult.Items[0];
      const variants = getItemsResponse.ItemsResult.Items[0].Images?.Variants;
      const primary = getItemsResponse.ItemsResult.Items[0].Images?.Primary;

      return {
        ItemsResult: {
          Items: [
            {
              ASIN: item.ASIN,
              DetailPageURL: item.DetailPageURL,
              Images: {
                Primary: primary || {},
                Variants: variants && (Object.keys(variants).length ? variants : primary) || {}
              },
              ItemInfo: {
                Title: item.ItemInfo?.Title || {},
                ByLineInfo: item.ItemInfo?.ByLineInfo || {},
                Classifications: item.ItemInfo?.Classifications || {},
                ContentInfo: item.ItemInfo?.ContentInfo || {},
                ContentRating: item.ItemInfo?.ContentRating || {},
                ExternalIds: item.ItemInfo?.ExternalIds || {},
                ManufactureInfo: item.ItemInfo?.ManufactureInfo || {},
                ProductInfo: item.ItemInfo?.ProductInfo || {},
                TechnicalInfo: item.ItemInfo?.TechnicalInfo || {},
                TradeInInfo: item.ItemInfo?.TradeInInfo || {},
                Features: item.ItemInfo?.Features || {}
              },
              Offers: {
                Listings: item.Offers?.Listings.map(listing => ({
                  Id: listing.Id || '',
                  Price: listing.Price || {},
                  Availability: listing.Availability || {},
                  Condition: listing.Condition || {},
                  DeliveryInfo: listing.DeliveryInfo || {},
                  IsBuyBoxWinner: listing.IsBuyBoxWinner || false,
                  LoyaltyPoints: listing.LoyaltyPoints || {},
                  MerchantInfo: listing.MerchantInfo || {},
                  ProgramEligibility: listing.ProgramEligibility || {},
                  Promotions: listing.Promotions || [],
                  SavingBasis: listing.SavingBasis || {},
                })) || [],
                Summaries: item.Offers?.Summaries || [],
              }
            }
          ]
        }
      };
    } else {
      return { error: 'Item not found.' };
    }
  } catch (error) {
    console.error('Error Message:', error.message);
    return { error: error.message };
  }
});
