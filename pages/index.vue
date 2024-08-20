<template>
  <div class="product-container">
    <!-- <pre v-if="product.error" class="errors">
      
    </pre> -->
    <input v-model="asin" placeholder="Enter ASIN" />
    <button @click="fetchProduct">Fetch Product</button>
    <div v-if="product" class="product-details">
      <h1 class="product-title">
        {{ product.ItemInfo?.Title?.DisplayValue || "No Title" }}
      </h1>
      <img
        :src="product.Images?.Primary?.Medium?.URL || ''"
        alt="Product Image"
        class="product-image"
        v-if="product.Images?.Primary?.Medium?.URL"
      />

      <!-- Variant Images -->
      <div class="variant-slider">
        <h2>Variant Images</h2>
        <Slider :images="smallVariantImages" />
      </div>


      <!-- Item Info -->
      <div class="item-info">
        <h2>Features</h2>
        <ul>
          <li
            v-for="feature in product.ItemInfo?.Features?.DisplayValues"
            :key="feature"
          >
            {{ feature }}
          </li>
        </ul>
        <p
          v-if="product.ItemInfo?.ByLineInfo?.DisplayValue"
          class="byline-info"
        >
          {{ product.ItemInfo.ByLineInfo.DisplayValue }}
        </p>
        <p
          v-if="product.ItemInfo?.ContentInfo?.ContentType"
          class="content-info"
        >
          Content Type: {{ product.ItemInfo.ContentInfo.ContentType }}
        </p>
        <p
          v-if="
            product.ItemInfo?.ContentRating?.Rating
              ? product.ItemInfo.ContentRating.Rating
              : 'No Rating'
          "
          class="content-rating"
        >
          Content Rating: {{ product.ItemInfo.ContentRating.Rating }}
        </p>
      </div>

      <div class="product-price">
        <p>
          Buying Price:
          {{ product.Offers?.Listings[0]?.Price?.DisplayAmount || "No Price" }}
        </p>
        <p v-if="product.Offers?.Listings[0]?.Price?.Savings">
          Savings:
          {{ product.Offers.Listings[0].Price.Savings.DisplayAmount }} ({{
            product.Offers.Listings[0].Price.Savings.Percentage
          }}%)
        </p>
        <p v-if="product.Offers?.Listings[0]?.SavingBasis">
          Saving Basis:
          {{ product.Offers.Listings[0].SavingBasis.DisplayAmount }}
        </p>
      </div>

      <div class="product-availability">
        <p>
          Availability:
          {{
            product.Offers?.Listings[0]?.Availability?.Message ||
            "Not Available"
          }}
        </p>
        <p>
          Min Order Quantity:
          {{
            product.Offers?.Listings[0]?.Availability?.MinOrderQuantity || "N/A"
          }}
        </p>
        <p>
          Availability Type:
          {{ product.Offers?.Listings[0]?.Availability?.Type || "N/A" }}
        </p>
      </div>

      <div class="product-delivery-info">
        <p>
          Amazon Fulfilled:
          {{
            product.Offers?.Listings[0]?.DeliveryInfo?.IsAmazonFulfilled
              ? "Yes"
              : "No"
          }}
        </p>
        <p>
          Free Shipping:
          {{
            product.Offers?.Listings[0]?.DeliveryInfo?.IsFreeShippingEligible
              ? "Yes"
              : "No"
          }}
        </p>
        <p>
          Prime Eligible:
          {{
            product.Offers?.Listings[0]?.DeliveryInfo?.IsPrimeEligible
              ? "Yes"
              : "No"
          }}
        </p>
      </div>

      <div class="product-condition">
        <p>
          Condition:
          {{
            product.Offers?.Listings[0]?.Condition?.Value || "No Condition Info"
          }}
        </p>
        <p v-if="product.Offers?.Listings[0]?.Condition?.SubCondition?.Value">
          Sub Condition:
          {{ product.Offers.Listings[0].Condition.SubCondition.Value }}
        </p>
      </div>

      <div
        class="product-merchant-info"
        v-if="product.Offers?.Listings[0]?.MerchantInfo"
      >
        <p>Merchant Name: {{ product.Offers.Listings[0].MerchantInfo.Name }}</p>
        <p>Merchant ID: {{ product.Offers.Listings[0].MerchantInfo.Id }}</p>
      </div>

      <div class="product-program-eligibility">
        <p>
          Prime Exclusive:
          {{
            product.Offers?.Listings[0]?.ProgramEligibility?.IsPrimeExclusive
              ? "Yes"
              : "No"
          }}
        </p>
        <p>
          Prime Pantry:
          {{
            product.Offers?.Listings[0]?.ProgramEligibility?.IsPrimePantry
              ? "Yes"
              : "No"
          }}
        </p>
      </div>

      <div class="product-is-buy-box-winner">
        <p>
          Buy Box Winner:
          {{ product.Offers?.Listings[0]?.IsBuyBoxWinner ? "Yes" : "No" }}
        </p>
      </div>

      <div class="product-summary">
        <h2>Price Summary</h2>
        <p
          v-for="summary in product.Offers?.Summaries || []"
          :key="summary.Condition?.Value"
        >
          Condition: {{ summary.Condition?.Value || "No Condition Info" }}
          <br />
          Highest Price:
          {{ summary.HighestPrice?.DisplayAmount || "No Highest Price" }}
          <br />
          Lowest Price:
          {{ summary.LowestPrice?.DisplayAmount || "No Lowest Price" }}
          <br />
          Offer Count: {{ summary.OfferCount || "N/A" }}
        </p>
      </div>

      <div class="product-info">
        <h2>Additional Information</h2>
        <p v-if="product.ItemInfo?.ByLineInfo?.DisplayValue">
          By Line Info: {{ product.ItemInfo.ByLineInfo.DisplayValue }}
        </p>
        <p v-if="product.ItemInfo?.Classifications?.DisplayValue">
          Classifications: {{ product.ItemInfo.Classifications.DisplayValue }}
        </p>
        <p v-if="product.ItemInfo?.ContentInfo?.DisplayValue">
          Content Info: {{ product.ItemInfo.ContentInfo.DisplayValue }}
        </p>
        <p v-if="product.ItemInfo?.ContentRating?.DisplayValue">
          Content Rating: {{ product.ItemInfo.ContentRating.DisplayValue }}
        </p>
        <p v-if="product.ItemInfo?.ExternalIds?.EAN">
          EAN: {{ product.ItemInfo.ExternalIds.EAN }}
        </p>
        <p v-if="product.ItemInfo?.ManufactureInfo?.Manufacturer">
          Manufacturer: {{ product.ItemInfo.ManufactureInfo.Manufacturer }}
        </p>
        <p v-if="product.ItemInfo?.ProductInfo?.Dimensions">
          Dimensions: {{ product.ItemInfo.ProductInfo.Dimensions }}
        </p>
        <p v-if="product.ItemInfo?.TechnicalInfo?.DisplayValue">
          Technical Info: {{ product.ItemInfo.TechnicalInfo.DisplayValue }}
        </p>
        <p v-if="product.ItemInfo?.TradeInInfo?.TradeInEligible">
          Trade-In Eligible:
          {{ product.ItemInfo.TradeInInfo.TradeInEligible ? "Yes" : "No" }}
        </p>
      </div>

      <p class="product-asin">ASIN: {{ product.ASIN }}</p>
      <p class="product-currency">
        Currency:
        {{ product.Offers?.Listings[0]?.Price?.Currency || "No Currency" }}
      </p>
      <a :href="product.DetailPageURL" target="_blank" class="product-link"
        >View on Amazon</a
      >
    </div>
  </div>
</template>

<script setup>
const asin = ref("");
const product = ref(null);

const fetchProduct = async () => {
  try {
    const response = await $fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ asin: asin.value }),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Fetched Data:", response);
    product.value = response?.ItemsResult?.Items[0] || null;
    console.log("Product Data:", product.value);
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const smallVariantImages = computed(() => {
  if (product.value && product.value.Images && product.value.Images.Variants) {
    return Object.values(product.value.Images.Variants)
      .filter(image => image.Medium)
      .map(image => ({ URL: image.Medium.URL }));
  }
  return [];
});
</script>

<style scoped>
.product-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.product-details {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #333;
}

.product-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 15px;
}

.product-image-variant {
  max-width: 100px;
  height: auto;
  margin-right: 10px;
  display: inline-block;
}

.product-images {
  margin-top: 10px;
}

.product-price,
.product-availability,
.product-delivery-info,
.product-condition,
.product-merchant-info,
.product-program-eligibility,
.product-is-buy-box-winner,
.product-summary,
.product-info {
  margin-top: 10px;
}

.product-price p,
.product-availability p,
.product-delivery-info p,
.product-condition p,
.product-merchant-info p,
.product-program-eligibility p,
.product-is-buy-box-winner p,
.product-summary p,
.product-info p {
  font-size: 1em;
  color: #333;
}

.product-info h2,
.product-summary h2 {
  margin-top: 20px;
  font-size: 1.2em;
  color: #333;
}

.product-link {
  display: inline-block;
  margin-top: 10px;
  color: #007185;
  text-decoration: none;
}

.product-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 16px;
  color: #fff;
  background-color: #007185;
  border-radius: 5px;
  text-decoration: none;
}

.product-link:hover {
  background-color: #005a5f;
}

.errors {
  background-color: red;
  color: white;
}
</style>