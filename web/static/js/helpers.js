export function reorderList(list, startIndex, endIndex) {
  const result = list //Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function removeTag(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      const [removed] = list.splice(i, 1)
      return { removed, i }
      break
    } else {
      removeTag(list[i].sub_tags, id)
    }
  }
}

function insertTag(list, target_id, buf_tag, create_sub_tag) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === target_id) {
      if (!create_sub_tag) {
        const ind = i >= buf_tag.i ? i + 1 : i
        console.log('insert to', ind)
        list.splice(ind, 0, buf_tag.removed)
      } else {
        list[i].sub_tags.splice(0, 0, buf_tag.removed)
      }

      return
      break
    } else {
      insertTag(list[i].sub_tags, target_id, buf_tag)
    }
  }
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
  source_id,
  target_id,
  start_level_index,
  end_level_index,
  create_sub_tag
) {
  //search array and index for remove tag
  //const source = searchTagsList([...list], start_level_index)
  //search array and index for insert tag
  //const target = searchTagsList([...list], end_level_index, create_sub_tag)

  //console.log('SOURCE', source, 'TARGET', target)
  let result = list
  console.log([...result])
  const buf_tag = removeTag(result, source_id)
  console.log(buf_tag, [...result])
  insertTag(result, target_id, buf_tag, create_sub_tag)
  console.log([...result])

  // const [removed] = source.list.splice(source.index, 1)
  // target.list.splice(target.index, 0, removed)
  return result
}
