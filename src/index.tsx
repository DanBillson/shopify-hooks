import React, { createContext, useContext, useState, useEffect } from 'react'
import Client from 'shopify-buy'

interface StoreProviderProps {
  storefrontAccessToken: string
  domain: string
  children: React.ReactChildren
}

const initialState = {
  client: null,
  isCartOpen: false,
  checkout: { lineItems: [] },
  products: [],
  shop: {},
}

export const StoreContext = createContext(initialState)

export const StoreProvider = ({
  storefrontAccessToken,
  domain,
  children,
}: StoreProviderProps) => {
  const [state, setState] = useState(initialState)
  const client = Client.buildClient({ storefrontAccessToken, domain })

  useEffect(() => {
    const initalizeStore = async () => {
      const checkout = await client.checkout.create()
      const products = await client.product.fetchAll()
      const shop = await client.shop.fetchInfo()

      setState({ ...state, client, checkout, products, shop })
    }
    initalizeStore()
  }, [])

  return (
    <StoreContext.Provider value={{ ...state }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
