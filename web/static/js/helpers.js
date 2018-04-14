export function reorderList(list, startIndex, endIndex) {
  const result = list //Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function searchTagsList(list, level_index, create_sub_tag) {
  let source_list = null
  let source_list_index = null
  level_index.forEach((ind, i) => {
    if (i > 0) {
      source_list = source_list[ind].sub_tags
    } else {
      source_list = list
    }
    source_list_index = ind
  })

  if (create_sub_tag) {
    source_list = source_list[source_list_index].sub_tags
    source_list_index = 0
  }

  return { list: source_list, index: source_list_index }
}

export function reorderTagsList(
  list,
  start_level_index,
  end_level_index,
  create_sub_tag
) {
  //search array and index for remove tag
  const source = searchTagsList(list, start_level_index)
  //search array and index for insert tag
  const target = searchTagsList(list, end_level_index, create_sub_tag)

  // if (create_sub_tag) {
  //   target.list.splice(target.index, 0, source.list[source.index])
  // }
  // const [removed] = source.list.splice(source.index, 1)
  // if (!create_sub_tag) {
  //   target.list.splice(target.index, 0, removed)
  // }

  // return list

  const [removed] = source.list.splice(source.index, 1)
  target.list.splice(target.index, 0, removed)
  return list
}
