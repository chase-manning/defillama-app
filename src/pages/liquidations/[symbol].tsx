/* eslint-disable no-unused-vars*/
// eslint sucks at types
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { revalidate } from '~/api'
import { ChartData, getLatestChartData } from '~/utils/liquidations'

import Layout from '~/layout'
import { LiquidationsSearch } from '~/components/Search'
import { Header } from '~/Theme'
import { LiquidationsHeader } from '../../components/LiquidationsPage/LiquidationsHeader'
import { LiquidationsContent } from '../../components/LiquidationsPage/LiquidationsContent'
import styled from 'styled-components'
import React, { useState } from 'react'

export const getStaticProps: GetStaticProps<ChartData> = async ({ params }) => {
	const symbol = params.symbol as string
	const data = await getLatestChartData(symbol.toUpperCase())
	return {
		props: data,
		revalidate: revalidate(5)
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	// TODO: make api for all tracked symbols
	const paths = ['ETH', 'WBTC', 'USDC', 'DAI', 'YFI', 'UNI'].map((x) => ({
		params: { symbol: x.toLowerCase() }
	}))
	return { paths, fallback: 'blocking' }
}

export const LiquidationsContext = React.createContext<{
	selectedSeries: {
		[key: string]: boolean
	}
	setSelectedSeries: React.Dispatch<
		React.SetStateAction<{
			[key: string]: boolean
		}>
	>
}>(null)

const LiquidationsProvider = ({ children }) => {
	const [selectedSeries, setSelectedSeries] = useState<{ [key: string]: boolean }>({})

	return (
		<LiquidationsContext.Provider value={{ selectedSeries, setSelectedSeries }}>
			{children}
		</LiquidationsContext.Provider>
	)
}

const LiquidationsHomePage: NextPage<ChartData> = (props) => {
	return (
		<Layout title={`${props.coingeckoAsset.name} (${props.symbol}) Liquidation Levels - DefiLlama`} defaultSEO>
			<LiquidationsSearch step={{ category: 'Liquidation Levels', name: props.symbol, hideOptions: true }} />
			<Header>Liquidation levels in DeFi 💦</Header>
			<LiquidationsHeader {...props} />
			<LiquidationsProvider>
				<LiquidationsContent {...props} />
			</LiquidationsProvider>
			<SmolHints>
				<p>
					🔍
					<i> To see liquidation levels for other assets, just use the search bar above!</i>
				</p>
			</SmolHints>
		</Layout>
	)
}

const SmolHints = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin-top: -1rem;
	opacity: 0.6;
`

export default LiquidationsHomePage
