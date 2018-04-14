export function reorderList(list, startIndex, endIndex) {
  const result = list //Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function searchTagsList(list, level_index) {
  let source_list = null
  let source_list_index = null
  level_index.forEach((ind, i) => {
    if (i > 0) {
      source_list = source_list.sub_tags
    } else {
      source_list = list
    }
    source_list_index = ind
  })
  return { list: source_list, index: source_list_index }
}

export function reorderTagsList(list, start_level_index, end_level_index) {
  //search array and index for remove tag
  const source = searchTagsList(list, start_level_index)
  //search array and index for insert tag
  const target = searchTagsList(list, end_level_index)

  const [removed] = source.list.splice(source.index, 1)
  target.list.splice(target.index, 0, removed)

  return list
}
