+ users
 - id
 - name
 - email
 - phone
 - password
 - avatar
 - role (admin, customer)
 - status (active, banned)

+ addresses
 - id
 - user_id
 - phone
 - province
 - city
 - district
 - commune
 - street
 - is_default

+ categories
 - id
 - name
 - slug
 - description
 - image
 - parent_id
 - status (active, inactive)

+ brands
 - id
 - name
 - logo
 - description
 - status

+ products
 - name
 - slug
 - description
 - short_description
 - category_id
 - brand_id
 - status
 - is_featured
 - is_new_arrival
 - view_count

+ product_variants
 - id
 - product_id
 - sku
 - price
 - sale_price
 - cost_price
 - weight
 - height
 - width
 - status

+ product_images
 - product_id
 - variant_id
 - image_url
 - is_thumbnail
 - sort_order

+ attributes
 - id
 - name

+ attribute_values
 - id
 - attribute_id
 - value

+ variant_attribute_values
 - variant_id
 - attribute_value_id

+ tags
 - id
 - name
 - slug

+ product_tags
 - product_id
 - tag_id

+ product_reviews
 - product_id
 - user_id
 - rating
 - comment
 - status

+ related_products
 - product_id
 - related_product_id

+ promotions
 - id
 - name
 - description
 - discount_type (percent, fixed)
 - discount_value
 - start_date
 - end_date
 - status

+ promotion_variants
 - promotion_id
 - variant_id

+ stock
 - id
 - variant_id
 - quantity
 - reserved
 - available

+ inventory_logs
 - id
 - variant_id
 - type
 - quantity
 - reference_id
 - note

+ carts
 - id
 - user_id

+ cart_items
 - id
 - cart_id
 - variant_id
 - quantity
 - price

+ orders
 - id
 - order_number
 - user_id
 - address_id
 - total_price
 - shipping_fee
 - discount
 - grand_total
 - payment_method
 - payment_status
 - order_status
 - note

+ order_items
 - id
 - order_id
 - variant_id
 - product_name
 - variant_name
 - price
 - quantity
 - subtotal

+ payments
 - id
 - order_id
 - payment_method
 - transaction_id
 - amount
 - status
 - paid_at

+ wishlists
 - id
 - user_id
 - product_id

+ banners
 - id
 - title
 - subtitle
 - description
 - image
 - link
 - position
 - status

+ posts
 - id
 - title
 - slug
 - content
 - featured_image
 - status

+ about
 - id
 - title
 - title_kh
 - content
 - content_kh
 - image
 - mission
 - vision

+ contacts
 - company_name
 - phone
 - email
 - address
 - google_map_url
 - facebook
 - instagram
 - telegram
 - whatsapp
 - working_hours

+ contact_messages
 - id
 - name
 - email
 - phone
 - subject
 - message
 - status

+ showrooms
 - id
 - name
 - phone
 - email
 - address
 - latitude
 - longitude
 - google_map_url
 - opening_hours
 - image

 