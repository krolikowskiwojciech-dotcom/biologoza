# Tnie arkusz ilustracji z ChatGPT (przezroczyste tło, siatka kolumny×wiersze) na osobne, wykadrowane kwadratowe PNG.
# Wersja Biologozy (na bazie Lingozy): w komórce bywa kilka zwierząt naraz (np. meduza + dżdżownica), więc zostaje WSZYSTKO,
# co do niej należy (obiekt przypisany po środku, nawet gdy wystaje poza siatkę), także półprzezroczyste szkło lupy.
# Wymaga Pillow, numpy i scipy (venv w scratchpadzie sesji). Potem: cwebp -q 86 -alpha_q 100 x.png -o x.webp
# Użycie: python tnij_arkusz.py <arkusz> <kolumny> <wiersze> <katalog_wyjsciowy> nazwa1,nazwa2,…  (pusta nazwa = pomiń komórkę)
import numpy as np
from PIL import Image
from scipy import ndimage


def tnij(sciezka, kolumny, wiersze, nazwy, katalog, rozmiar=256, margines=0.05):
    img = Image.open(sciezka).convert('RGBA')
    tab = np.asarray(img)
    W, H = img.size
    widoczne = tab[..., 3] > 12
    # obiekty na całym arkuszu (bliskie kawałki tego samego rysunku łączymy); każdy należy do komórki, w której leży
    # jego środek — nawet gdy wystaje poza siatkę (np. dżdżownica przy krawędzi komórki)
    lab, n = ndimage.label(ndimage.binary_dilation(widoczne, iterations=4))
    srodki = ndimage.center_of_mass(widoczne, lab, range(1, n + 1))
    rozm = ndimage.sum(widoczne, lab, range(1, n + 1))
    cw, ch = W / kolumny, H / wiersze
    yy, xx = np.indices((H, W))
    nr_piksela = (yy // ch).astype(int) * kolumny + (xx // cw).astype(int)  # komórka siatki pod każdym pikselem
    obiekty = ndimage.find_objects(lab)
    przydzial = np.zeros((H, W), int) - 1  # numer komórki, do której należy piksel
    for j, (cy, cx) in enumerate(srodki):
        if rozm[j] < 0.0004 * W * H:  # pył
            continue
        sy, sx = obiekty[j]
        m = lab == j + 1
        if (sx.stop - sx.start) > 1.25 * cw or (sy.stop - sy.start) > 1.25 * ch:
            # zlepek dwóch sąsiadów (np. lis i nietoperz): najpierw rozdzielamy po rzeczywistych konturach (bez sklejania
            # bliskich kawałków); kawałek dalej za szeroki tniemy po liniach siatki
            sub, ns = ndimage.label(m & widoczne)
            for q, (qy, qx) in enumerate(ndimage.center_of_mass(m & widoczne, sub, range(1, ns + 1))):
                mq = sub == q + 1
                qsy, qsx = ndimage.find_objects(mq.astype(int))[0]
                if (qsx.stop - qsx.start) > 1.25 * cw or (qsy.stop - qsy.start) > 1.25 * ch:
                    przydzial[mq] = nr_piksela[mq]
                else:
                    przydzial[mq] = int(qy // ch) * kolumny + int(qx // cw)
        else:
            przydzial[m] = int(cy // ch) * kolumny + int(cx // cw)
    for i, nazwa in enumerate(nazwy):
        maska = (przydzial == i) & widoczne
        if not nazwa or not maska.any():
            continue
        # po rozcięciu po siatce zostają okruchy sąsiada (np. czubek ogona) — małe kawałki odrzucamy
        lk, nk = ndimage.label(ndimage.binary_dilation(maska, iterations=3))
        if nk > 1:
            wk = ndimage.sum(maska, lk, range(1, nk + 1))
            maska &= np.isin(lk, [x + 1 for x in range(nk) if wk[x] >= 0.04 * wk.max()])
        ys, xs = np.where(maska)
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        wyc = tab[y0:y1 + 1, x0:x1 + 1].copy()
        wyc[~maska[y0:y1 + 1, x0:x1 + 1]] = 0
        k = Image.fromarray(wyc, 'RGBA')
        s = int(max(k.width, k.height) * (1 + 2 * margines))
        kw = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        kw.paste(k, ((s - k.width) // 2, (s - k.height) // 2))
        kw.resize((rozmiar, rozmiar), Image.LANCZOS).save(f'{katalog}/{nazwa}.png', optimize=True)
        print(nazwa, k.size)


if __name__ == '__main__':
    import sys
    arkusz, kol, wie, kat, nazwy = sys.argv[1:6]
    tnij(arkusz, int(kol), int(wie), nazwy.split(','), kat)
