// Shopify API service for fetching product data
const SHOPIFY_STOREFRONT_URL = 'https://rr8xtm-qy.myshopify.com/api/2025-01/graphql.json';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '04a9813095c4c6db0aa70cd28bf308e9';
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  productType: string;
  featuredImage?: {
    url: string;
  };
  variants: {
    sku: string;
    price: number;
    currencyCode: string;
  }[];
}
// GraphQL query to fetch products from a collection
// Increased the limit to 100 to ensure all products are fetched
const getCollectionProductsQuery = (handle: string) => {
  return `
  {
    collection(handle: "${handle}") {
      id
      title
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            productType
            featuredImage {
              url
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  sku
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
};

// GraphQL query to fetch products from multiple collections using field aliases
const getMultiCollectionProductsQuery = (handles: string[]) => {
  const selections = handles.map((handle, idx) => `
    col${idx}: collection(handle: "${handle}") {
      id
      title
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            productType
            featuredImage { url }
            variants(first: 5) {
              edges {
                node {
                  id
                  sku
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `).join('\n');
  return `
  {
    ${selections}
  }
  `;
};
// Fetch products from a collection
export const fetchCollectionProducts = async (collectionHandle: string, maxPrice?: number, includeUnisex?: boolean): Promise<ShopifyProduct[]> => {
  try {
    const query = includeUnisex
      ? getMultiCollectionProductsQuery([collectionHandle, 'unisex'])
      : getCollectionProductsQuery(collectionHandle);
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Transform the response data into our ShopifyProduct format
    const transformEdgesToProducts = (edges: any[]): ShopifyProduct[] => {
      return edges.map((edge: any) => {
        const product = edge.node;
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description || '',
          tags: product.tags || [],
          productType: product.productType || '',
          featuredImage: product.featuredImage,
          variants: product.variants.edges.map((variantEdge: any) => {
            const variant = variantEdge.node;
            return {
              sku: variant.sku,
              price: parseFloat(variant.price.amount),
              currencyCode: variant.price.currencyCode
            };
          })
        };
      });
    };

    let products: ShopifyProduct[] = [];
    if (includeUnisex) {
      const collectionsData = data.data || {};
      const allEdges: any[] = Object.keys(collectionsData).reduce((acc: any[], key: string) => {
        const edges = collectionsData[key]?.products?.edges || [];
        return acc.concat(edges);
      }, []);
      products = transformEdgesToProducts(allEdges);
    } else if (data.data?.collection?.products?.edges) {
      products = transformEdgesToProducts(data.data.collection.products.edges);
    }
    // Apply price filtering in JavaScript if maxPrice is provided
    if (maxPrice !== undefined) {
      products = products.filter(product => {
        const productPrice = product.variants[0]?.price || 0;
        return productPrice <= maxPrice;
      });
    }
    console.log(`Fetched ${products.length} products from ${includeUnisex ? collectionHandle + ' + unisex' : collectionHandle} collection(s)`);
    return products;
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
};
// Generate Amazon URL from SKU
export const generateAmazonUrl = (sku: string) => {
  if (!sku) {
    return 'https://www.amazon.co.uk';
  }
  return `https://www.amazon.co.uk/dp/${sku}`;
};
// Format price with currency symbol
export const formatPrice = (price: number, currencyCode: string = 'GBP') => {
  return currencyCode === 'GBP' ? `£${price.toFixed(2)}` : `${price.toFixed(2)} ${currencyCode}`;
};
// Helper function to truncate text to a specific length
export const truncateTitle = (title: string, maxLength: number = 60): string => {
  if (!title) return '';
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};
// Helper function to format description text
export const formatDescription = (description: string): string => {
  if (!description) return '';
  // Remove common prefixes like "Product Features:", "Product Overview:", "Brand:"
  // Using a more aggressive approach to catch variations
  let cleanDescription = description.replace(/^(?:product\s+features|product\s+overview|brand|features|overview)(?:\s*:|\.|\s)\s*/i, '').replace(/^product\s+features\s+/i, '') // Catch "Product features " without colon
  .trim();
  // Convert to lowercase first
  cleanDescription = cleanDescription.toLowerCase();
  // Capitalize first letter of each sentence
  cleanDescription = cleanDescription.split('. ').map(sentence => {
    if (sentence.length > 0) {
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }
    return sentence;
  }).join('. ');
  // Capitalize first letter of the entire description
  if (cleanDescription.length > 0) {
    cleanDescription = cleanDescription.charAt(0).toUpperCase() + cleanDescription.slice(1);
  }
  return cleanDescription;
};