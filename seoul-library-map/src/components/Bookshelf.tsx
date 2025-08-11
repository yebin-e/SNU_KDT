import { useEffect } from 'react'
import * as d3 from 'd3'

export type ShelfItem = {
  name: string
  count: number
}

export type BookshelfProps = {
  containerId: string
  items: ShelfItem[]
}

export function Bookshelf({ containerId, items }: BookshelfProps) {
  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const svgId = `${containerId}-svg`
    let svg = d3.select(container).select(`#${svgId}`) as d3.Selection<SVGSVGElement, unknown, null, undefined>
    if (svg.empty()) {
      svg = d3
        .select(container)
        .append('svg')
        .attr('id', svgId)
        .attr('width', width)
        .attr('height', height)
        .style('display', 'block')
    }

    // Clear previous
    svg.selectAll('*').remove()

    if (!items || items.length === 0) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6b7280')
        .text('데이터 없음')
      return
    }

    // Layout: 3 shelves
    const shelves = 3
    const shelfPadding = 16
    const shelfHeight = (height - shelfPadding * (shelves + 1)) / shelves

    const color = d3.scaleOrdinal<string, string>()
      .domain(items.map((d) => d.name))
      .range(d3.schemeTableau10)

    // Compute proportional widths per item
    const bookPadding = 2

    for (let s = 0; s < shelves; s++) {
      const y = shelfPadding + s * (shelfHeight + shelfPadding)

      svg
        .append('rect')
        .attr('x', 8)
        .attr('y', y + shelfHeight - 4)
        .attr('width', width - 16)
        .attr('height', 6)
        .attr('fill', '#b45309')

      const group = svg.append('g').attr('transform', `translate(12, ${y + 6})`)
      const usableWidth = width - 24

      // Split items roughly evenly across shelves for readability
      const itemsPerShelf = Math.ceil(items.length / shelves)
      const startIdx = s * itemsPerShelf
      const endIdx = Math.min((s + 1) * itemsPerShelf, items.length)
      const shelfItems = items.slice(startIdx, endIdx)
      const shelfTotal = d3.sum(shelfItems, (d: ShelfItem) => d.count)

      let x = 0
      shelfItems.forEach((item) => {
        const w = Math.max(8, (item.count / shelfTotal) * usableWidth - bookPadding)
        group
          .append('rect')
          .attr('x', x)
          .attr('y', 0)
          .attr('width', w)
          .attr('height', shelfHeight - 14)
          .attr('rx', 2)
          .attr('fill', color(item.name))
          .append('title')
          .text(`${item.name}: ${item.count.toLocaleString()}`)

        // Spine label
        if (w > 24) {
          group
            .append('text')
            .attr('x', x + w / 2)
            .attr('y', (shelfHeight - 14) / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#111827')
            .attr('font-size', 10)
            .text(item.name)
        }
        x += w + bookPadding
      })
    }
  }, [containerId, items])

  return null
}

export default Bookshelf