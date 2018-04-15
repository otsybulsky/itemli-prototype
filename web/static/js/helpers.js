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
    } else {
      const removed = removeTag(list[i].sub_tags, id)
      if (removed) {
        return removed
      }
    }
  }
}

function insertTag(list, target_id, buf_tag, create_sub_tag) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === target_id) {
      if (!create_sub_tag) {
        const ind = i >= buf_tag.i ? i + 1 : i
        list.splice(ind, 0, buf_tag.removed)
      } else {
        list[i].sub_tags.splice(0, 0, buf_tag.removed)
      }
      return true
    } else {
      const isInsert = insertTag(list[i].sub_tags, target_id, buf_tag)
      if (isInsert) {
        return isInsert
      }
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
  create_sub_tag,
  tags
) {
  console.log('REORDER', tags[source_id], tags[target_id])
  let result = [...list]
  const buf_tag = removeTag(result, source_id, list)
  insertTag(result, target_id, buf_tag, create_sub_tag)
  return result
}
