import { createWallEntry, fetchWallEntries } from '../src/api/comments.ts'

async function main() {
  const overrideMessage = process.argv.slice(2).join(' ').trim()
  const message =
    overrideMessage.length > 0 ? overrideMessage : 'Testing wall integration via wallSmoke.ts'

  const before = await fetchWallEntries()
  console.log('Entries before:', before.length)

  const created = await createWallEntry({
    fullName: 'Dev Server Smoke',
    message,
  })
  console.log('Created entry:', created.id)

  const after = await fetchWallEntries()
  console.log('Entries after:', after.length)
}

main().catch((error) => {
  console.error('Smoke test failed:', error)
  process.exit(1)
})

