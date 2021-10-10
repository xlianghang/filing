#include <archive.h>
#include <archive_entry.h>
#include <emscripten.h>
#include <stdint.h>
#include <stdlib.h>
#include <locale.h>
using namespace std;

extern  "C"
EMSCRIPTEN_KEEPALIVE
void * extract(
  const char* ptr,
  size_t size,
  const char* locale
) {
  struct archive* a;
  struct archive_entry* entry;
  int r;
  setlocale(LC_ALL, locale);
  a = archive_read_new();
  archive_read_support_filter_all(a);
  archive_read_support_format_all(a);

  r = archive_read_open_memory(a, ptr, size);
   if (r != ARCHIVE_OK){
    fprintf(stderr, "Memory read error %d\n",r);
    fprintf(stderr, "%s\n",archive_error_string(a));
  }
  return a;
}

extern  "C"
EMSCRIPTEN_KEEPALIVE
const void* get_next_entry(struct archive *archive) {
  struct archive_entry *entry;
  int ret = archive_read_next_header(archive, &entry);
  if (ret != ARCHIVE_OK) {
    return NULL;
  }
  return entry;
}

extern  "C"
EMSCRIPTEN_KEEPALIVE
void* get_filedata(struct archive *a, size_t buffsize){
  void *buff = malloc( buffsize );
  int read_size = archive_read_data(a, buff, buffsize);
  if( read_size < 0 ){
    return (void*) read_size;
  }

  return buff;
}