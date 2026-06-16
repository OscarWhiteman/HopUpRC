import { useState, useEffect } from 'react'
import models from './data/models.json'
import hornetData from './data/hornet.json'
import lunchboxData from './data/lunchbox.json'
import grasshopperData from './data/grasshopper.json'
import hotshotData from './data/hotshot.json'
import monsterBeetleData from './data/monster-beetle.json'
import frogData from './data/frog.json'
import wildOneData from './data/wild-one.json'
import boomerangData from './data/boomerang.json'
import foxData from './data/fox.json'
import sandScorcherData from './data/sand-scorcher.json'
import roughRiderData from './data/rough-rider.json'
import superShotData from './data/super-shot.json'
import avanteData from './data/avante.json'
import holidayBuggyData from './data/holiday-buggy.json'
import fireDragonData from './data/fire-dragon.json'
import bigwigData from './data/bigwig.json'
import superAstute from './data/super-astute.json'
import topForceData from './data/top-force.json'
import terraScorcherData from './data/terra-scorcher.json'
import grasshopperIIData from './data/grasshopper-ii.json'
import vqsData from './data/vqs.json'
import thunderDragonData from './data/thunder-dragon.json'
import superStormDragonData from './data/super-storm-dragon.json'
import fastAttackVehicleData from './data/fast-attack-vehicle.json'
import stadiumBlitzerData from './data/stadium-blitzer.json'
import mantaRayData from './data/manta-ray.json'
import thunderShotData from './data/thunder-shot.json'
import topForceEvolutionData from './data/top-force-evolution.json'
import sandRoverData from './data/sand-rover.json'
import xr311Data from './data/xr311.json'
import egressData from './data/egress.json'
import fightingBuggyData from './data/fighting-buggy.json'
import avanteBlackSpecialData from './data/avante-black-special.json'
import hotshotIIData from './data/hotshot-ii.json'
import hotshotIIBlockheadData from './data/hotshot-ii-blockhead.json'
import wildWilly2Data from './data/wild-willy-2.json'
import blackfoot2016Data from './data/blackfoot-2016.json'
import superClodBusterData from './data/super-clod-buster.json'
import subaruBratData from './data/subaru-brat.json'
import bullheadData from './data/bullhead.json'
import ModelSelector from './components/ModelSelector'
import PartsList from './components/PartsList'
import HopUpList from './components/HopUpList'
import GlobalSearch from './components/GlobalSearch'
import ShoppingList from './components/ShoppingList'
import UniversalParts from './components/UniversalParts'

const ALL_MODEL_DATA = {
  hornet: hornetData,
  lunchbox: lunchboxData,
  grasshopper: grasshopperData,
  hotshot: hotshotData,
  'monster-beetle': monsterBeetleData,
  frog: frogData,
  'wild-one': wildOneData,
  boomerang: boomerangData,
  fox: foxData,
  'sand-scorcher': sandScorcherData,
  'rough-rider': roughRiderData,
  'super-shot': superShotData,
  avante: avanteData,
  'holiday-buggy': holidayBuggyData,
  'fire-dragon': fireDragonData,
  bigwig: bigwigData,
  'super-astute': superAstute,
  'top-force': topForceData,
  'terra-scorcher': terraScorcherData,
  'grasshopper-ii': grasshopperIIData,
  vqs: vqsData,
  'thunder-dragon': thunderDragonData,
  'super-storm-dragon': superStormDragonData,
  'fast-attack-vehicle': fastAttackVehicleData,
  'stadium-blitzer': stadiumBlitzerData,
  'manta-ray': mantaRayData,
  'thunder-shot': thunderShotData,
  'top-force-evolution': topForceEvolutionData,
  'sand-rover': sandRoverData,
  xr311: xr311Data,
  egress: egressData,
  'fighting-buggy': fightingBuggyData,
  'avante-black-special': avanteBlackSpecialData,
  'hotshot-ii': hotshotIIData,
  'hotshot-ii-blockhead': hotshotIIBlockheadData,
  'wild-willy-2': wildWilly2Data,
  'blackfoot-2016': blackfoot2016Data,
  'super-clod-buster': superClodBusterData,
  'subaru-brat': subaruBratData,
  bullhead: bullheadData,
}

const SEARCH_INDEX = Object.entries(ALL_MODEL_DATA).flatMap(([modelId, data]) => [
  ...data.stockParts.map((p) => ({ modelId, modelName: data.name, type: 'Stock', ...p })),
  ...data.hopUps.map((p) => ({ modelId, modelName: data.name, type: 'Hop-Up', ...p })),
])

const CROSS_REF = {}
const _PART_META = {}
for (const data of Object.values(ALL_MODEL_DATA)) {
  for (const part of data.stockParts) {
    if (!CROSS_REF[part.partNumber]) {
      CROSS_REF[part.partNumber] = []
      _PART_META[part.partNumber] = { name: part.name, category: part.category }
    }
    if (!CROSS_REF[part.partNumber].includes(data.name)) {
      CROSS_REF[part.partNumber].push(data.name)
    }
  }
}

const UNIVERSAL_PARTS = Object.entries(CROSS_REF)
  .filter(([, models]) => models.length >= 3)
  .map(([partNumber, models]) => ({
    partNumber,
    models,
    name: _PART_META[partNumber].name,
    category: _PART_META[partNumber].category,
    count: models.length,
  }))
  .sort((a, b) => b.count - a.count)

const TABS = ['Stock Parts', 'Hop-Up Options']

export default function App() {
  const [selectedModelId, setSelectedModelId] = useState(null)
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [showUniversalParts, setShowUniversalParts] = useState(false)
  const [highlightPart, setHighlightPart] = useState(null)
  const [hopUpList, setHopUpList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hopUpList') || '{}') }
    catch { return {} }
  })

  const modelDetail = selectedModelId ? ALL_MODEL_DATA[selectedModelId] : null
  const listCount = Object.entries(hopUpList).filter(([key]) => {
    const bar = key.indexOf('|')
    const modelId = key.slice(0, bar)
    const partNumber = key.slice(bar + 1)
    return ALL_MODEL_DATA[modelId]?.hopUps.some((h) => h.partNumber === partNumber)
  }).length

  useEffect(() => {
    history.replaceState({ view: 'home' }, '')
    function onPopState(e) {
      const s = e.state ?? { view: 'home' }
      if (s.view === 'model') {
        setSelectedModelId(s.modelId)
        setShowShoppingList(false)
        setShowUniversalParts(false)
        setCategoryFilter('All')
        setActiveTab(TABS[0])
        setSearchQuery('')
      } else if (s.view === 'shopping') {
        setShowShoppingList(true)
        setShowUniversalParts(false)
        setSelectedModelId(null)
      } else if (s.view === 'universal') {
        setShowUniversalParts(true)
        setShowShoppingList(false)
        setSelectedModelId(null)
      } else {
        setSelectedModelId(null)
        setShowShoppingList(false)
        setShowUniversalParts(false)
        setCategoryFilter('All')
        setActiveTab(TABS[0])
        setSearchQuery('')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function handleUniversalParts() {
    setShowUniversalParts(true)
    setShowShoppingList(false)
    setSelectedModelId(null)
    history.pushState({ view: 'universal' }, '')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function handleSelectModel(id, highlight = null) {
    setShowShoppingList(false)
    setShowUniversalParts(false)
    if (id === selectedModelId && !highlight) return
    setCategoryFilter('All')
    setActiveTab(highlight?.type === 'Hop-Up' ? TABS[1] : TABS[0])
    setSearchQuery('')
    setSelectedModelId(id)
    setHighlightPart(highlight)
    history.pushState({ view: 'model', modelId: id }, '')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function handleHome() {
    setSelectedModelId(null)
    setShowShoppingList(false)
    setShowUniversalParts(false)
    setCategoryFilter('All')
    setActiveTab(TABS[0])
    setSearchQuery('')
    history.pushState({ view: 'home' }, '')
  }

  function toggleHopUpStatus(modelId, partNumber, status) {
    const key = `${modelId}|${partNumber}`
    setHopUpList((prev) => {
      const next = { ...prev }
      if (next[key] === status) {
        delete next[key]
      } else {
        next[key] = status
      }
      localStorage.setItem('hopUpList', JSON.stringify(next))
      return next
    })
  }

  const categories = modelDetail
    ? ['All', ...new Set(modelDetail.stockParts.map((p) => p.category))]
    : []

  const hopUpCategories = modelDetail
    ? ['All', ...new Set(modelDetail.hopUps.map((p) => p.category))]
    : []

  function applySearch(items) {
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (p) =>
        p.partNumber.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }

  const filteredParts = applySearch(
    modelDetail && activeTab === TABS[0]
      ? categoryFilter === 'All'
        ? modelDetail.stockParts
        : modelDetail.stockParts.filter((p) => p.category === categoryFilter)
      : []
  )

  const filteredHopUps = applySearch(
    modelDetail && activeTab === TABS[1]
      ? categoryFilter === 'All'
        ? modelDetail.hopUps
        : modelDetail.hopUps.filter((p) => p.category === categoryFilter)
      : []
  )

  function handleTabChange(tab) {
    setActiveTab(tab)
    setCategoryFilter('All')
    setHighlightPart(null)
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <button className="site-logo" onClick={handleHome} aria-label="Go to home">
            <span className="logo-hopup">HopUp</span>
            <span className="logo-rc">RC</span>
          </button>
          <p className="site-tagline">Vintage Tamiya RC Parts Reference</p>
          <nav className="header-nav">
            <button
              className={`header-nav-link${showUniversalParts ? ' active' : ''}`}
              onClick={handleUniversalParts}
            >
              Universal Parts
            </button>
          </nav>
          <div className="header-actions">
            <button
              className={`list-btn${showShoppingList ? ' active' : ''}`}
              onClick={() => {
                const next = !showShoppingList
                setShowShoppingList(next)
                setShowUniversalParts(false)
                setSelectedModelId(null)
                history.pushState(next ? { view: 'shopping' } : { view: 'home' }, '')
              }}
            >
              My List
              {listCount > 0 && <span className="list-badge">{listCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {showUniversalParts ? (
          <UniversalParts universalParts={UNIVERSAL_PARTS} />
        ) : showShoppingList ? (
          <>
            <ShoppingList
              hopUpList={hopUpList}
              allModelData={ALL_MODEL_DATA}
              onToggleStatus={toggleHopUpStatus}
              onSelectModel={handleSelectModel}
            />
          </>
        ) : selectedModelId ? (
          <>
            <section className="model-detail">
                <div className="model-header">
                  <div>
                    <h2 className="model-name">{modelDetail.name}</h2>
                    <div className="model-meta">
                      <span className="badge">{modelDetail.driveType}</span>
                      <span className="badge">{modelDetail.scale}</span>
                      <span className="badge">{modelDetail.category}</span>
                      <span className="item-numbers">
                        Item {modelDetail.itemNumbers.join(' / ')}
                      </span>
                    </div>
                    <p className="model-description">{modelDetail.description}</p>
                  </div>
                </div>

                <div className="tab-bar">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      className={`tab-btn${activeTab === tab ? ' active' : ''}`}
                      onClick={() => handleTabChange(tab)}
                    >
                      {tab}
                      <span className="tab-count">
                        {tab === TABS[0]
                          ? modelDetail.stockParts.length
                          : modelDetail.hopUps.length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="search-bar">
                  <input
                    className="search-input"
                    type="search"
                    placeholder="Search by part number, name, or description…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-bar">
                  {(activeTab === TABS[0] ? categories : hopUpCategories).map((cat) => (
                    <button
                      key={cat}
                      className={`filter-btn${categoryFilter === cat ? ' active' : ''}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {activeTab === TABS[0] && (
                  <PartsList
                    key={selectedModelId}
                    parts={filteredParts}
                    crossRef={CROSS_REF}
                    currentModelName={modelDetail.name}
                    modelId={selectedModelId}
                    highlightPartNumber={highlightPart?.type !== 'Hop-Up' ? highlightPart?.partNumber : null}
                  />
                )}
                {activeTab === TABS[1] && (
                  <HopUpList
                    hopUps={filteredHopUps}
                    modelId={selectedModelId}
                    hopUpList={hopUpList}
                    onToggleStatus={toggleHopUpStatus}
                    highlightPartNumber={highlightPart?.type === 'Hop-Up' ? highlightPart?.partNumber : null}
                  />
                )}
            </section>
          </>
        ) : (
          <>
            <GlobalSearch
              searchIndex={SEARCH_INDEX}
              onSelectModel={handleSelectModel}
            />
            <div className="browse-divider"><span>or browse by model</span></div>
            <ModelSelector
              models={models}
              selectedModelId={selectedModelId}
              onSelect={handleSelectModel}
            />
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>HopUpRC — Community reference tool. Not affiliated with Tamiya Co., Ltd.</p>
      </footer>
    </div>
  )
}
