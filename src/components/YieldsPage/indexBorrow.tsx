import * as React from 'react'
import { useRouter } from 'next/router'
import { Panel } from '~/components'
import { YieldsBorrowTable } from '~/components/Table'
import { YieldFilters } from '~/components/Filters'
import { useFormatYieldQueryParams } from './hooks'
import { toFilterPool } from './utils'

const YieldPageBorrow = ({ pools, projectList, chainList, categoryList, tokens, tokenSymbolsList }) => {
	const { query, pathname } = useRouter()
	const { minTvl, maxTvl, minApy, maxApy } = query

	const { selectedProjects, selectedChains, selectedAttributes, includeTokens, excludeTokens, selectedCategories } =
		useFormatYieldQueryParams({ projectList, chainList, categoryList })

	const poolsData = React.useMemo(() => {
		return pools.reduce((acc, curr) => {
			const toFilter = toFilterPool({
				curr,
				pathname,
				selectedProjects,
				selectedChains,
				selectedAttributes,
				includeTokens,
				excludeTokens,
				selectedCategories,
				minTvl,
				maxTvl,
				minApy,
				maxApy
			})

			if (toFilter) {
				return acc.concat({
					pool: curr.symbol,
					configID: curr.pool,
					projectslug: curr.project,
					project: curr.projectName,
					airdrop: curr.airdrop,
					chains: [curr.chain],
					apyBase: curr.apyBase,
					apyReward: curr.apyReward,
					apyBorrow: curr.apyBorrow,
					apyBaseBorrow: curr.apyBaseBorrow,
					apyRewardBorrow: curr.apyRewardBorrow,
					totalSupplyUsd: curr.totalSupplyUsd,
					totalBorrowUsd: curr.totalBorrowUsd,
					totalAvailableUsd: curr.totalAvailableUsd,
					url: curr.url,
					ltv: curr.ltv,
					rewardTokensSymbols: curr.rewardTokensSymbols,
					rewards: curr.rewardTokensNames
				})
			} else return acc
		}, [])
	}, [
		minTvl,
		maxTvl,
		minApy,
		maxApy,
		pools,
		selectedProjects,
		selectedCategories,
		selectedChains,
		selectedAttributes,
		includeTokens,
		excludeTokens,
		pathname
	])

	return (
		<>
			<YieldFilters
				header="Yield Rankings"
				poolsNumber={poolsData.length}
				projectsNumber={selectedProjects.length}
				chainsNumber={selectedChains.length}
				tokens={tokens}
				tokensList={tokenSymbolsList}
				selectedTokens={includeTokens}
				chainList={chainList}
				selectedChains={selectedChains}
				projectList={projectList}
				selectedProjects={selectedProjects}
				attributes={true}
				resetFilters={true}
			/>

			{poolsData.length > 0 ? (
				<YieldsBorrowTable data={poolsData} />
			) : (
				<Panel as="p" style={{ margin: 0, textAlign: 'center' }}>
					Couldn't find any pools for these filters
				</Panel>
			)}
		</>
	)
}

export default YieldPageBorrow
