import { useState } from 'react'
import models from './data/models.json'
import hornetData from './data/hornet.json'
import lunchboxData from './data/lunchbox.json'
import grasshopperData from './data/grasshopper.json'
import hotshotData from './data/hotshot.json'
import monsterBeetleData from './data/monster-beetle.json'
import blackfootData from './data/blackfoot.json'
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
import ModelSelector from './components/ModelSelector'
import PartsList from './components/PartsList'
import HopUpList from './components/HopUpList'
import GlobalSearch from './components/GlobalSearch'
import ShoppingList from './components/ShoppingList'

const ALL_MODEL_DATA = {
  hornet: hornetData,
  lunchbox: lunchboxData,
  grasshopper: grasshopperData,
  hotshot: hotshotData,
  'monster-beetle': monsterBeetleData,
  blackfoot: blackfootData,
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
}

const SEARCH_INDEX = Object.entries(ALL_MODEL_DATA).flatMap(([modelId, data]) => [
  ...data.stockParts.map((p) => ({ modelId, modelName: data.name, type: 'Stock', ...p })),
  ...data.hopUps.map((p) => ({ modelId, modelName: data.name, type: 'Hop-Up', ...p })),
])

const CROSS_REF = {}
for (const data of Object.values(ALL_MODEL_DATA)) {
  for (const part of data.stockParts) {
    if (!CROSS_REF[part.partNumber]) CROSS_REF[part.partNumber] = []
    if (!CROSS_REF[part.partNumber].includes(data.name)) {
      CROSS_REF[part.partNumber].push(data.name)
    }
  }
}

const TABS = ['Stock Parts', 'Hop-Up Options']

export default function App() {
  const [selectedModelId, setSelectedModelId] = useState(null)
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [hopUpList, setHopUpList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hopUpList') || '{}') }
    catch { return {} }
  })

  const modelDetail = selectedModelId ? ALL_MODEL_DATA[selectedModelId] : null
  const listCount = Object.keys(hopUpList).length

  function handleSelectModel(id) {
    setShowShoppingList(false)
    if (id === selectedModelId) return
    setCategoryFilter('All')
    setActiveTab(TABS[0])
    setSearchQuery('')
    setSelectedModelId(id)
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
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">
            <span className="logo-hop">Hop</span>
            <span className="logo-up">Up</span>
            <span className="logo-rc">RC</span>
          </div>
          <p className="site-tagline">Vintage Tamiya RC Parts Reference</p>
          <div className="header-actions">
            <button
              className={`list-btn${showShoppingList ? ' active' : ''}`}
              onClick={() => setShowShoppingList((s) => !s)}
            >
              My List
              {listCount > 0 && <span className="list-badge">{listCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {showShoppingList ? (
          <>
            <ModelSelector
              models={models}
              selectedModelId={selectedModelId}
              onSelect={handleSelectModel}
            />
            <ShoppingList
              hopUpList={hopUpList}
              allModelData={ALL_MODEL_DATA}
              onToggleStatus={toggleHopUpStatus}
              onSelectModel={handleSelectModel}
            />
          </>
        ) : selectedModelId ? (
          <>
            <ModelSelector
              models={models}
              selectedModelId={selectedModelId}
              onSelect={handleSelectModel}
            />
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
                    parts={filteredParts}
                    crossRef={CROSS_REF}
                    currentModelName={modelDetail.name}
                  />
                )}
                {activeTab === TABS[1] && (
                  <HopUpList
                    hopUps={filteredHopUps}
                    modelId={selectedModelId}
                    hopUpList={hopUpList}
                    onToggleStatus={toggleHopUpStatus}
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
